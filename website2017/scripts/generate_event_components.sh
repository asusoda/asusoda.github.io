cd java/EventComponent/
gradle -q run
cd ../..
cat java/EventComponent/CompiledEventComponentsFiles/* node/react_js.jsx > node/final.jsx
