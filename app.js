var express = require('express')
  , http = require('http')
  , path = require('path')
  , favicon = require('serve-favicon')
  , logger = require('morgan')
  , cookieParser = require('cookie-parser')
  , bodyParser = require('body-parser')
  , methodOverride = require('method-override')
  , session = require('cookie-session')
  , swig = require('swig')
  , errorHandler = require('errorhandler')
  , compress = require('compression')

var app = express();

app.engine('html', swig.renderFile);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.enable('trust proxy');

// app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(compress({
  memLevel: 3,
  level: 3
}));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(cookieParser());

app.use(session({
  key: 'whiteboard',
  secret: 'this-should-be-put-somewhere-else',
  proxy: true
}));
app.use(methodOverride());

var env = process.env.NODE_ENV || 'development';

switch (env) {
  case 'production':
    app.set('view cache', true);

    app.use(function(err, req, res, next){
      res.status(404).render('error');
    });
    break;
  case 'test':
    // app.use(logger('dev'));
    
    app.use(errorHandler({
      dumpExceptions : true,
      showStack : true
    }));

    app.set('view cache', false);
    break;
  default:
    app.use(logger('dev'));

    app.use(errorHandler({
      dumpExceptions : true,
      showStack : true
    }));

    app.set('view cache', false);
    break;
}

app.use(express.static('public'));

// Routes
app.get('/', function(req, res){
  res.render('index.html');
});

var faye = require('./faye')

// Get params
var argv = require('optimist').argv;

// port
var port = argv.port || 4000;

var server = app.listen(port, function() {
  console.log('Express server listening on port ', server.address().port);
  faye.attach(server);
  console.log("Faye Server listening on port: " + port);
  console.log("Faye is mounted to /faye");
});