# Open Access Tool Tray System

Details on OATTS can be found [here] (http://wiki.gpii.net/w/OATTS_%28Open_Access_Tool_Tray_System%29)

## Client Installation Instructions: 

- There are two parts to the code. Client-side and server-side.
- To run OATTS, you will need to unzip the client-side zip file, and then load the unpacked extension in Google Chrome. Instructions on how to load an unpacked extension in Google Chrome [here](https://developer.chrome.com/extensions/getstarted#unpacked)
- Launch the extension from Chrome. Currently, the program can be operated in the Demo mode. 
- Use the 'Tool Changer' to select tool widgets to add to the tray. 
- Each individual widget launches a new window with a specific service. 

## Server Installation Instructions:

## Using a Docker container

This is the easier and more secure method to install the application. [Docker](http://docker.io) must be installed and running in the server.

Follow the steps that you can find in [Docker-OATTS source container](https://github.com/gpii-ops/docker-oatts-server#build-the-container)

## Manual installation

If you don't want to use Docker containers, you can install the application with the following steps:

1. Install a webserver, PHP and MySQL or MariaDB.

 *  [Debian based](https://www.howtoforge.com/installing-nginx-with-php5-and-php-fpm-and-mysql-support-lemp-on-debian-wheezy)
 *  [Redhat based](https://www.digitalocean.com/community/tutorials/how-to-install-linux-nginx-mysql-php-lemp-stack-on-centos-6)

2. Configure OATTS

 Some variables must be setted before running OATTS. Those variables are stored in the files:

 * OATTS Server-Side/etc/oattsincludes/config/server.php
 * OATTS Server-Side/html/oatts/includes/path.php

3. Copy the code

  ```
  cp $SOURCE_DIR/OATTS Server-Side/* /var/www/
  ```
4. Set webserver root path to html directory

  The root of the webserver must be the *html* directory.


# Testing and development

You must have installed [VirtualBox](https://www.virtualbox.org/wiki/Downloads) and [Vagrant](http://www.vagrantup.com/downloads.html) applications in your PC.

Follow the documented steps that you can find in [Docker-OATTS source container](https://github.com/gpii-ops/docker-oatts#development-and-testing)

