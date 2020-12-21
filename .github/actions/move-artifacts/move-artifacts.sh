#!/bin/bash

ls ./packages/artifacts

artifacts=( "assets/cdn" "assets/dist" "assets/bin" "components-js/dist/components-wrapper" "components-angular/projects/components-wrapper/src/lib" "components-react/projects/components-wrapper/src/lib" "partials/dist" "utilities/projects/utilities" )
for source in ${artifacts[@]}; do
  source=./artifacts/${source}
  dest=./packages/${source}
  ls ${source}
  echo "Moving ${source} to ${dest}"
  mv ${source} ${dest}
done
