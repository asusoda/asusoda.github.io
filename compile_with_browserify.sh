cd node
browserify -t [ babelify --presets [ react stage-3 ] ] react_js.jsx -o ../files/file2.txt
cd ..
cat files/* > index.html
echo "compiled and new index.html has been generated with browserify"