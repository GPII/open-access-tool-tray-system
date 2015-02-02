#!/bin/bash
sudo chown -R trace *
sudo chgrp -R www-data *

sudo find . -type d -exec chmod u=rwx,g=rx,o= '{}' \;

sudo find . -type f -exec chmod u=rw,g=r,o= '{}' \;

