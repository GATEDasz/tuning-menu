fx_version "cerulean"

description "A Camber Resource for FiveM"
author "Kyle & Matt Gambino"
version '1.0.0'

lua54 'yes'

games {
  "gta5"
}

ui_page 'web/build/index.html'


client_scripts{
  '@PolyZone/client.lua',
  '@PolyZone/BoxZone.lua',
}

server_scripts{
  'server/server.lua'
  
}

client_script "client/**/*"


files {
	'web/build/index.html',
	'web/build/**/*',
}