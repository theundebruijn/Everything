#!/usr/bin/zsh
case "$1" in

  audit)
    echo "theu0000-output-code-web -> audit";
    docker exec -u thisisalocaluser -it theu0000-output-code-web /bin/bash -c "cd /usr/src/app && npm audit"
    ;;

  build)
    echo "theu0000-output-code-web -> build";
    docker exec -u thisisalocaluser -it theu0000-output-code-web /bin/bash -c "cd /usr/src/app && npm run build"
    ;;

  chown)
    echo "theu0000-output-code-web -> chown";
    docker exec -u root -it theu0000-output-code-web /bin/bash -c "chown -R thisisalocaluser:thisisalocaluser /usr/src/app"
    ;;

  clean)
    echo "theu0000-output-code-web -> clean";
    docker exec -u thisisalocaluser -it theu0000-output-code-web /bin/bash -c "cd /usr/src/app && npm run clean"
    ;;

  install)
    echo "theu0000-output-code-web -> install";
    docker exec -u thisisalocaluser -it theu0000-output-code-web /bin/bash -c "cd /usr/src/app && npm install"
    ;;

  start)
    echo "theu0000-output-code-web -> start";
    docker exec -u thisisalocaluser -it theu0000-output-code-web /bin/bash -c "cd /usr/src/app && npm run start"
    ;;

  update)
    echo "theu0000-output-code-web -> update";
    docker exec -u thisisalocaluser -it theu0000-output-code-web /bin/bash -c "cd /usr/src/app && npm run update"
    ;;

  upgrade)
    echo "theu0000-output-code-web -> upgrade";
    docker exec -u thisisalocaluser -it theu0000-output-code-web /bin/bash -c "cd /usr/src/app && npm run upgrade && npm install"
    ;;
  *) echo "no valid argument supplied"; exit 1 ;;

esac