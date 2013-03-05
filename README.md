# Node/Marionete boilerplate

This is a boilerplate project structure for Node.js and Marionette.js application.

It aims to provide a base for starting a new application saving you from the
cumbersome setup and wiring-up everything from the start every time. Instead, just
clone this boilerplate and work off of it.

You will get a base structure for application files organization, together
with a Grunt build script that manages building a client-side application and
preparing it to be served by the Node server, as well as running tests for
both client-side Marionette.js and server-side Node.js application.

*This boilerplate is just a personal toolchain extracted from the project I've
been working on, allowing me to both explore Grunt plugins and kick-off 
new projects more easily. For a more advanced toolset and workflow, check
[Yeoman.io](http://yeoman.io/) project which does a lot more than this boilerplate.*

## Configuration

### Server-side Node.js application

Node.js application depends on several environment variables that need to be set.
Script that takes care of setting those is included with the project, and needs
to be referenced from your `.bashrc` file. To do so, open the `~/.bashrc` file in
your text editor (create one if it doesn't exist) and add the following line to it:

    source <path/to/project>/scripts/envvars.sh

This will include the content of the script setting the environment variables, and
you will have them set from now on when you open a new terminal window.

## License

Released under [MIT license](LICENSE.txt)