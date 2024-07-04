from driver import WebDriverWrapper
import subprocess

driver = WebDriverWrapper()

driver.get_league_standings("brazil", 'serie-a')
driver.get_league_standings("brazil", 'serie-b')
# driver.get_league_standings("england", 'premier-league')

driver.get_league_fixtures("brazil", 'serie-a')
driver.get_league_fixtures("brazil", 'serie-b')
# driver.get_league_fixtures("england", 'premier-league')

if driver.alert_tony == "True":
  driver.send_email("Quais são as chances", driver.get_email_body)

driver.close()
