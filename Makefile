
dependencies:
	npm cache clean
	bower cache clean
	npm install
	bower install

clean:
	rm -rf node_modules/
	rm -rf app/bower_components/

build:
	make clean
	make dependencies
	gulp build


.PHONY : build
