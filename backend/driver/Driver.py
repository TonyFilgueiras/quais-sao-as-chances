import json
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.common.exceptions import NoSuchElementException, ElementNotInteractableException, StaleElementReferenceException, TimeoutException
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.remote.webelement import WebElement

from datetime import datetime, timedelta

import os
import ssl
import smtplib
from email.message import EmailMessage
from dotenv import load_dotenv

from time import sleep
from config import REMOTE_DEBUGGING_PORT

class WebDriverWrapper:
    def __init__(self):
        self._driver = webdriver.Chrome()
        self._email_body = ""

    def __enter__(self):
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        pass
    
    def __getattr__(self, attr):
        return getattr(self.driver, attr)
    
    def navigate(self, url):
        self.driver.get(url)

    def kill(self):
        self.driver.quit()
    def close(self):
        print("Driver closed")
        self.driver.close()

    def get_league_standings(self, country: str, division: str ):
        print(f"Getting league standings | país = {country} | divisão = {division}")
        self.navigate(f"https://www.flashscore.com/football/{country}/{division}/standings")
        try:
            table = WebDriverWait(self.driver, self.local_wait_time*2).until(EC.presence_of_element_located((By.XPATH, '//*[@id="tournament-table-tabs-and-content"]/div[3]/div[1]/div/div/div[2]'))) 
            rows = table.find_elements(By.CLASS_NAME, "ui-table__row")
            
            self.get_league_info(country, division)

            table_data = []
            for row in rows:
                position = row.find_element(By.CLASS_NAME, "tableCellRank").text

                logo = row.find_element(By.CLASS_NAME, "participant__image").get_attribute('src')
                team_name = row.find_element(By.CLASS_NAME, "tableCellParticipant__name").text

                matches = row.find_element(By.XPATH, './span[1]').text
                wins = row.find_element(By.XPATH, './span[2]').text
                draws = row.find_element(By.XPATH, './span[3]').text
                losses = row.find_element(By.XPATH, './span[4]').text

                goal_difference = row.find_element(By.CLASS_NAME, "table__cell--goalsForAgainstDiff").text
                points = row.find_element(By.CLASS_NAME, "table__cell--points").text

                new_team_data = {
                    'position': int(position.rstrip('.')),
                    'logo': logo,
                    'team_name': team_name,
                    'matches': int(matches),
                    'wins': int(wins),
                    'draws': int(draws),
                    'losses': int(losses),
                    'goal_difference': int(goal_difference),
                    'points': int(points)
                }

                table_data.append(new_team_data)

            self.write_json(f"{self.relative_path}/public/data/{country}/{division}/table_data.json", table_data)
            print("League standings updated")
            self.write_email_body(f"✅ Standings Updated: Standings from {country.capitalize()} {division} updated successfully")
        except:
            self.log_error("Timed out waiting for standings")
            self.write_email_body(f"❌ Error on updating standings: Standings from {country.capitalize()} {division} was not updated successfully")


    def get_league_info(self, country:str, division:str):
        print(f"Getting league info | país = {country} | divisão = {division}")
        league_info = {}

        logo = WebDriverWait(self.driver, self.local_wait_time).until(EC.presence_of_element_located((By.CLASS_NAME, 'heading__logo'))).get_attribute("src")
        name = WebDriverWait(self.driver, self.local_wait_time).until(EC.presence_of_element_located((By.CLASS_NAME, 'heading__name'))).text
        year = WebDriverWait(self.driver, self.local_wait_time).until(EC.presence_of_element_located((By.CLASS_NAME, 'heading__info'))).text

        if country == "brazil":
            country_name = "Brasileirão "
        elif country == "england":
            country_name = ""
        else:
            country_name = country.capitalize() + " "

        league_info = {
            'logo': logo,
            'name': country_name + name,
            'year': year,
        }

        self.write_json(f"{self.relative_path}/public/data/{country}/{division}/league_info.json", league_info)
        print("League info updated")

    def get_league_fixtures(self, country: str, division: str):
        print(f"Getting league fixtures | país = {country} | divisão = {division}")
        self.navigate(f"https://www.flashscore.com/football/{country}/{division}/fixtures/")

        fixtures_data = []
        id = 0
        try:
            while True:
                try:
                    more_matches_button = WebDriverWait(self.driver, self.local_wait_time).until(EC.presence_of_element_located((By.XPATH, '//*[@id="live-table"]/div[1]/div/div/a')))
                    if more_matches_button:
                        self.execute_script("arguments[0].scrollIntoView();", more_matches_button)
                        print("scrolled")
                        more_matches_button.click()
                        print("clicked")
                except:
                    print("No more matches button found. Exiting loop.")
                    break 

            fixtures = WebDriverWait(self.driver, self.local_wait_time).until(EC.presence_of_element_located((By.XPATH, '//*[@id="live-table"]/div[1]/div/div')))
            fixtures_elements = fixtures.find_elements(By.XPATH, ".//*")

            for element in fixtures_elements:
                element_class = element.get_attribute("class")
                if element_class is not None:
                    if "event__round--static" in element_class:
                        round_text = element.text
                        round = int(round_text[-2:])
                    if "event__match" in element_class:
                        date_text = element.find_element(By.CLASS_NAME, "event__time").text
                        date = date_text.replace('.', '/', 1).replace('.', '').replace("Postp", "")
                        date = self.adjust_date_time(date)
                        home_team = element.find_element(By.CLASS_NAME, "event__participant--home").text
                        home_logo = element.find_element(By.CLASS_NAME, "event__logo--home").get_attribute("src")
                        away_team = element.find_element(By.CLASS_NAME, "event__participant--away").text
                        away_logo = element.find_element(By.CLASS_NAME, "event__logo--away").get_attribute("src")


                        new_fixture_data = {
                            'id': id,
                            "round": round,
                            "date": date,
                            'home_logo': home_logo,
                            'home_team': home_team,
                            'home_score': None,
                            'away_logo': away_logo,
                            'away_team': away_team,
                            'away_score': None,
                        }

                        fixtures_data.append(new_fixture_data)
                        id+=1
        except StaleElementReferenceException as e:
            self.log_error("Erro de StaleElement")
            print("-" *50)
            self.log_error(e)
            self.write_email_body(f"❌ Error on updating fixtures: Fixture from {country.capitalize()} {division} was not updated successfully")
        except TimeoutException:
            print("Timed out waiting for fixtures to load. It's possible that all games have been played.")
        self.write_json(f"{self.relative_path}/public/data/{country}/{division}/fixtures_data.json", fixtures_data)
        print("League fixtures updated")
        self.write_email_body(f"✅ Fixture Updated: Fixture from {country.capitalize()} {division} updated successfully")

    def write_json(self, name: str, data: list):
        with open(name, 'w') as json_file:
            json.dump(data, json_file, indent=2)

    def send_email(self, subject:str, body:str):
        load_dotenv()
        email_sender = os.environ.get("EMAIL_SENDER")
        email_password = os.environ.get("EMAIL_PASSWORD")
        email_receiver = os.environ.get("EMAIL_RECEIVER")

        em = EmailMessage()
        em["From"] = email_sender
        em["To"] = email_receiver
        em["Subject"] = subject
        em.set_content(body)

        context = ssl.create_default_context()

        with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
            server.login(email_sender, email_password)
            try:
                server.sendmail(email_sender, email_receiver.split(",") , em.as_string())
                print("email sent")
            except Exception as e:
                self.log_error(f"Error sending mail: {e}")

    def write_email_body(self, text: str):
        current_body = self.get_email_body
        new_body = current_body + "\n" + text
        self.set_email_body(new_body)


    def adjust_date_time(self, date: str) -> str:
        try:
            date_parts = date.split(" ")[:2]

            date_text = " ".join(date_parts).strip()

            original_datetime = datetime.strptime(date_text, "%d/%m %H:%M")

            time_difference_hours = self.local_time_adjustment

            # Create a timedelta object with the time difference
            time_difference = timedelta(hours=time_difference_hours)
            # Adjust the original datetime by adding the time difference
            adjusted_datetime = original_datetime + time_difference

            # Format the datetime objects to exclude the year
            adjusted_formatted = adjusted_datetime.strftime("%d/%m %H:%M")
            return adjusted_formatted
        except Exception as e:
            print(e)
            print(date)
            self.write_email_body(f"Erro ao conveter hora do jogo: {date}")
            self.log_error("Erro ao conveter hora do jogo")
            return date 


    def log_error(self, error: str):
        print(f"\033[91m{error}\033[00m")

    def set_email_body(self, text):
        self._email_body = text

    @property    
    def get_email_body(self):
        return self._email_body

    @property
    def options(self):
        opt = webdriver.ChromeOptions()
        opt.add_experimental_option("debuggerAddress", f"localhost:{REMOTE_DEBUGGING_PORT}")

        return opt
    
    @property
    def driver(self):
        return self._driver
    
    @property
    def relative_path(self):
        load_dotenv()
        relative_path = os.environ.get("RELATIVE_PATH")
        return relative_path

    @property
    def local_time_adjustment(self):
        load_dotenv()
        local_time = int(os.environ.get("LOCAL_TIME_ADJUSTMENT"))
        return local_time

    @property
    def local_wait_time(self):
        load_dotenv()
        local_wait_time = int(os.environ.get("LOCAL_WAIT_TIME"))
        return local_wait_time

    @property
    def alert_tony(self):
        load_dotenv()
        send_email = os.environ.get("SEND_EMAIL")
        return send_email

    @property
    def actions(self):
        return ActionChains(self.driver)
    

    

