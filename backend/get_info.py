from driver import WebDriverWrapper
import subprocess

driver = WebDriverWrapper()

driver.get_league_standings("brazil", 'serie-a')
driver.get_league_standings("brazil", 'serie-b')
driver.get_league_standings("england", 'premier-league')

driver.get_league_fixtures("brazil", 'serie-a')
driver.get_league_fixtures("brazil", 'serie-b')
driver.get_league_fixtures("england", 'premier-league')

driver.close()
