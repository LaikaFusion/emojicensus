# emojicensus

If you're reading this, well for one hi. 

So the process here is pretty much, create an env with your slack key (SLACK_KEY), knex migrate, knex seed, run the main program and that'll dump you a sqlite db with all the messages. From there you'll probably want to run emoji census, take the output from there and run the post processing.js file. As you go along it'll get rougher and rougher.
