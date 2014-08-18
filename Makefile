
dependencies:
	npm cache clean
	npm install
	bower cache clean
	bower install

build:
	make dependencies
	gulp build


.PHONY : build
