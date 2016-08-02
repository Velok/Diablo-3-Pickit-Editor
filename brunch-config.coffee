module.exports = config:
  conventions:
    assets: [
        /static\//,
        /libs\//,
        /backend\//
    ]
    ignored: [
      /.+_info\.txt$/
      /.+\.jshintrc$/
    ]
    vendor: /#/
  plugins:
    jaded:
      staticPatterns: /^app(\/|\\)markup(\/|\\)(.+)\.jade$/
      jade:
        pretty: yes
    babel:
      pattern: /\.es6$/
  files:
    stylesheets: joinTo:
      'app.css': /styles\//
    javascripts: joinTo:
      'app.js': /scripts\//
      'libs.js': /^(?!app\/)/
      'backend/file.js': /backend\/file.*/
    templates: joinTo:
      'templates.js': /templates\//
