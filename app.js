const ejs = require('ejs'),
      express = require('express'),
      mongoose = require('mongoose'),
      fileUpload = require('express-fileupload'),
      methodOverride = require('method-override');

const photo = require('./models/Photo'), // oluşturduğum schemayı aldım
      photoController = require('./controllers/photoController'),
      pageController = require('./controllers/pageController');

const app = express();

//Database connect

mongoose.connect('mongodb://localhost:27017/fotografci_portfolio', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB bağlantısı başarılı");
  })
  .catch((err) => {
    console.error("MongoDB bağlantı hatası:", err);
  });


//VİEW ENGİNE
app.set('view engine', 'ejs');

//MİDDLEWARE
app.use(express.static('public')); // Static dosyaları koyacağımız klasörü seçtik
app.use(express.urlencoded({ extended: true })); // Body parser
app.use(express.json()); // Body parser
app.use(fileUpload());
app.use(methodOverride('_method', { methods: ['POST', 'GET'] }));

//ROUTES
app.get('/', photoController.getAllPhotos);
app.get('/photo/:photo_id', photoController.getPhotoPage);
app.get('/photo/edit/:photo_id', photoController.getEditPage);
app.put('/photo/:photo_id', photoController.photoUpdate);
app.post('/photos', photoController.photoUpload);
app.delete('/photo/:photo_id', photoController.photoDelete);

app.get('/about', pageController.getAboutPage);
app.get('/add', pageController.getAddPage);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server ${port} portunda dinleniyor`);
});
