# PCAT Projesi Express Nodemon Kurulumu
## PCAT Express Nodemon Kurulumu
Artık projemize başlıyoruz. Öncelikle npm i express --save ile express modülünü indirelim. --save flagı kullanmak zorunlu değildir. Express i bu şekilde indirmek ile aslında söylediğimiz şu: Uygulamamızın çalışması için express modülüne bağımlıdır yani express, Node.js uygulamamız açısında bir dependency dir. Package.json dosyasını incelediğimizde prettier modülünü bir devDependency dir, yani biz bu modülü sadece kendi geliştirmemiz için kullanıyoruz, bu modüller olmasa da uygulamamız çalışır.  

## Nodemon
Şimdiye kadar uygulamamızda yaptığımız değişikliklerin aktif hale gelmesi için sunucumuzu durdurup tekrar çalıştırmamız gerekirdi. Bunu engellemek yani sunucuyu tekrar çalıştırmadan değişikliklerin algılanması için nodemon modülünü indireceğiz.

`
npm install --save-dev nodemon
`
burada --save-dev flagı yardımıyla nodemon modülünün bir devDependency olduğunu belirtiyoruz. İndirme işlemi tamamlandıktan sonra package.json dosyasında yeni bir script oluşturacağız.

`
"start": "nodemon app.js"
`
sonrasında npm start komutuyla uygulamamızı başlatabiliriz.

Kodumuzun son hali aşağıdadır.  

```javascript
const express = require('express');

const app = express();

app.get('/', (req, res) => {

  const photo = {
    id: 1,
    name: "Photo Name",
    description: "Photo description"
  }
  res.send(photo)
})

const port = 3000;
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda başlatıldı..`);
});
```


﻿# Statik Dosyalar - Middleware Giriş

## Statik Dosyalarla Çalışmak
Bir web uygulaması oluştururken, bu uygulamanın iskeleti statik dosyalardır. Biz oluşturmak istediğimiz uygulamanın iskelet yapısı ile ilgili css, html, js dosyalarını ve görsellerini öncelikle göndermek isteriz.

Bir express uygulamasında statik dosyaları kullanmak için, express web çatısının express.static gömülü middleware fonksiyonu kullanılır. Bu statik dosyaları uygulamanın kök klasörü içerisindeki public isminde bir klasör oluşturup, statik dosyaların tamamını bu klasörün içerisine koyalım. app.js dosyasının içerisinde de aşağıdaki kodu eklememiz gerekiyor.

`app.use(express.static('public'));`

## Middleware
Yukarıda söylediğimiz birşey var, diyoruz ki express.static bir middleware fonksiyonudur, peki şunu soralım o zaman middleware nedir? Daha önce söylediğimiz gibi Node.js uygulaması temelinde bir request ve response döngüsüdür. Biz bir istekte bulunuyoruz ve buna karşılık bir cevap istiyoruz. İşte bu request - response döngüsünün içerisindeki görevi olan her fonksiyona middleware denir. Yani herşey request ve responsun 'middle'ında ortasında yapılır.

- Herhangi bir fonksiyon çalıştırılabiliriz.
- Request ve Response nesnelerini değiştirebiliriz.
- Request - Response döngüsü sonlandırılabilir.
- next() metodu ile sonraki middleware çağırılabilinir.

Aşağıdaki görselde klasik middleware yapısını görebilirsiniz. Gördüğünüz üzere get request de bir middlewaredir. Dikkatinizi çekecek bir diğer nokta kodumuzda next metodu kullanmıyoruz çünkü send ile aynı döngüyü sonlandırıyoruz '/' adresine ulaşmak için.  

![middleWre](https://github.com/Kodluyoruz/taskforce/raw/node.js/node-js/StaticFilesMiddleware/figures/middleware.png)  

Şimdi kendi middleware fonksiyonumuzu oluşturalım myLogger isminde.

```javascript
  const myLogger = (req, res, next) => {
  console.log('Middleware Log 1');
  next();
  }
```  
Bu middleware'i çalıştırmak için kaydetmemiz gerekiyor.

```javascript
app.use(express.static('public'));
app.use(myLogger);
```  

uygulamamızı çalıştırdığımızda myLogger middleware kodumuzunda çalıştığını göreceksiniz.  


Son olarak statik dosyalarımızı çalıştırdık, peki ilgili html dosyalarına nasıl ulaşacağız. Aslında bunun daha kolay bir yöntemini göreceğiz ileride ancak burada öncelikle path modülünü çağıralım.

```javascript
const path = require('path');
```

sonrasında ise temp klasörü içerisindeki index.html dosyasına ulaşmak için

```javascript
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'temp/index.html'));
});
```
kodunu kullanacağız. Uygulamamızı tekrar çalıştırdığımızda index sayfamızı başarılı bir şekilde görebiliriz.

﻿
## Template Engine Kavramı
Statik dosyalarımızı kullanmaya başladık ve bir önceki çalışmamızda index.html sayfasına ulaştık. Sayfa içeriğini de görebiliyoruz ancak burada şöyle bir sorunumuz var buradaki içeriklerimiz statik yani değişmez içerikler ancak biz sayfamızın dinamik bir şekilde çalışmasını yani içeriğinde değişiklikler yapmayı isteriz. İşte burada template engine -şablon motoru- kavramı devreye girer.


## Template Engine Nedir?
Yukarıda belirtiğimiz gibi dinamik olan değişen bir içeriği sabit .html sayfasında gösteremeyiz. Template engine bize bu değişen içeriğin html kodu içerisinde dosya uzantısı değiştirilerek kullanmamızı sağlar. Template engineler sayesinde bir static dosyaları ve değieşn dinamik içeriği birlikte kullanabiliriz. Farklı template engineler kullanılabiliriz, biz bu çalışmamızda EJS template engine yapısını kullanacağız.

## EJS Template Engine

EJS, Embedded Java Script kelimelerinden oluşur ve bize saf Javascript kodlarıkullanmamıza imkan verirken aynı zamanda çalışmamıza ait değişen içerikleri de kullanabiliriz.



` npm i ejs `  
komutuyla ejs modülünü indirebiliriz. Ejs modülünü çağıralım ve uygulamamıza template engine olarak "ejs" kullanacağımızı belirtelim.

```javascript
const ejs = require('ejs');

//Template Engine
app.set("view engine", "ejs");
```  

EJS modülü template dosyaları görebilmek için varsayılan olarak views klasörünün içerisindeki .ejs uzantılı dosyalara bakar. Bu ne denle temp dosyamızın ismini views olarak değiştiriyoruz. Videws klasörü içerisindeki tüm .html uzantılarını .ejs olarak değiştiriyoruz. Uygulamamızdaki .get metodunu düzenlersek, bu şekilde '/' isteğine karşılık index.ejs dosyasını render ederiz.

```javascript
app.get("/", (req, res) => {
  res.render('index');
});
```
http://localhost:3000/ adresine tarayıcımızdan istek gönderdiğimizde index sayfamızı başarılı bir şekilde görebileceğiz. Yalnız burada tüm .ejs dosyalarını incelediğimizde bazı ortak bölümlerin bulunduğunu görebiliriz. Bu ortak alanları views/partials klasörünün içerisine yerleştireceğiz. Burada yapmamız gereken _header.ejs, _footer.ejs, _navigation.ejs dosyalarını oluşturarak ortak kod bölümlerini buraya yapıştıralım. index template dosyasının yanında diğer template dosyalarımızı da düzenleyelim. About ve Add New Post sayfaları için gerekli yönlendirmeleri yapalım.

```javascript
app.get("/about", (req, res) => {
  res.render('about');
});

app.get("/add_post", (req, res) => {
  res.render('add_post');
});
```
sonra _navigation.ejs de linkleri güncelleyelim.

```javascript
 <li class="nav-item">
  <a class="nav-link" href="/">Home</a>
</li>
<li class="nav-item">
  <a class="nav-link" href="/about">About</a>
</li>
<li class="nav-item">
  <a class="nav-link" href="/add_post">Add New Post</a>
</li>
```
son olarak add.ejs syafamızı video içeriğimize göre güncelleyelim.


﻿
## Request Body Nasıl Çalışır?
Artık uygulamamıza dinamik özellikler verme zamanı geldi. İlk işlev olarak ne yapmak isteriz? Uygulamamızın Add Photo sayfasından yükleyeceğimiz fotoğraf bilgisini bir şekilde ana sayfamıza taşımak isteriz. Bunu yaparken "add photo" sayfamızda kullanacağız metot POST ve action='/photos' olacak.

Burada "add photo" sayfadan gelen post metodunu yakalamamız için ilgili yönlendirmeyi yakalayıp, consolda request nesnesinden gelen body bilgisini yakalayalım.


```javascript
app.post('/photos', (req, res) => {
  console.log(req.body);
  res.redirect('/')
});
```  

add photo sayfasından bilgileri gönderdiğimizde consol da undefined sonucunu görüyoruz. Bunun nedeni body ile saklanan verinin yakalanamıyor olması. Bu body bilgisini yakalamak için 2 adet middleware fonksiyonunu kullanmamız gerekir.  

```javascript
app.use(express.urlencoded( {extended:true} ))
app.use(express.json())
});
```
bunun sonucunda bilgileri tekrar gönderdiğimizde consolda body bilgisini bir nesne halinde yakalarız. Ayrıca res.redirect('/') nedeniyle ana sayfaya yönlendirildi. { title: 'Photo Title 1', description: 'Photo description 1' }

#### Daha Fazlası İçin
- [Express Json](https://expressjs.com/en/4x/api.html#express.json)  
- [Express Urlencoded](https://expressjs.com/en/4x/api.html#express.urlencoded)

﻿## Model ve Dinamik İçerik
Geçen çalışmamızda "add photo" sayfamızdan göndericeğimiz verileri nasıl yakalayacağımızı konuştuk. Peki aslında ne yapmak isteriz? Gelen photo bilgilerini yakalayıp oluşturacağımız model ile veritabanına bir döküman olarak yazdırıp sonrasında bu verileri uygun yerde listelemek isteriz.

İlk yapmamız gereken ihtiyacımız olan modeli oluşturmak. models/Photo.js dosyası oluşturalım. Photo.js:

```javascript
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create schema
const PhotoSchema = new Schema({
  title: String,
  description: String,
  image: String,
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

const Photo = mongoose.model('Photo', PhotoSchema);

module.exports = Photo;
});
```  

sonrasında app.js dosyasına bu modelimizi çağıralım.

```javascript
const Photo = require('./models/Photo');
```  

POST metodu ile gelen veriyi model dosyamız ile yakalayıp veritabanına gönderelim.

```javascript
app.post('/photos', async (req, res) => { // async - await yapısı kullanacğız.
  await Photo.create(req.body)            // body bilgisini Photo modeli sayesinde veritabanında dökümana dönüştürüyoruz.
  res.redirect('/')
});
```
Yukarıdaki yöntemi kullanarak veritabanımızda yeni photo bilgileri oluşturabiliriz. Bu verileri projemizde anasayfamızda sıralamak istiyoruz. Bunun için ise aşağıdaki kodu yazmamız gerekiyor.

```javascript
app.get('/', async (req, res) => {
  const photos = await Photo.find({})
  res.render('index', {
    photos
  });
```  

Photo bilgilerini anasayfaya '/' yardımıyla gönderiyoruz. Peki ilgili index template'in bu verileri alması için gerekli düzenlemeleri yapmamız gerekiyor. Aşağıdaki koları index.ejs dosyasının içerisine yerleştirmemiz gerekiyor.

```javascript
<% photos.forEach(element => { %>
<%= element.title %>
<%= element.description %>
<% }) %>
```

﻿## Tekil Fotoğraf Sayfaları
Geçen çalışmamızda veri tabanından Photo bilgilerini alıp anasayfamızda listeliyoruz. Bu çalışmamızda bu Photo bilgilerini her birinin kendine özel sayfalarını oluşturacağız.


Öncelikle tekil sayfalarımızını template'i olan photo.ejs dosyasını oluşturacağız. Burada sormamız gereken soru şu, biz her tekil Photo bilgisini diğerlerinden nasıl ayıracağız? Bunun için MongoDB'nin her Photo bilgisi için otomatik olarak oluşturduğu _id özelliğinden faydalanacağız. Peki bu _id leri nasıl yakalayacağız? Bunun için index.ejs de diğer Photo alanları gibi yakalanabilir.



```javascript
<%= photos[i]._id %>
```  

ve bunu link olarak kullanacağız. Bunun için /photos/photos[i]._id yazıyoruz index.ejs template içerisine. Sıra bunu _id yi ilgili yönlendirme "route" aşamasında yakalayacağız. Bunun için request nesnesine ait "params" ı kullanacağız. Aşağıda ilgili _id yi yakalayıp consol ' a yazdıralım.



```javascript
app.get("/photos/:id", (req, res) => {
  console.log(req.params.id);
});
```  

Artık anasayfadaki linklerin üzerlerine geldiğimizde id leri görebiliriz. Şimdi bu id bilgisinden faydalanarak içgili Photo yu yakalayalım ve photo.ejs ye gönderelim.



```javascript
<%= photo.title %>
<%= photo.description %>
```
Photo.ejs template dosyasına gönderdiğimiz ilgili photo versine ait bilgileri aşağıdaki şekilde gösterebiliriz.

```javascript
<%= photo.title %>
<%= photo.description %>
```  

Bu şekilde de ilgili photo sayfasına verileri yerleştirmiş olduk.

![site](https://i.ibb.co/PhJ8SXK/ezgif-com-gif-maker.gif)

adres çubunğunda her fotoğraf gönderisi için farklı link görüyoruz
![adres çubuğu](https://i.ibb.co/NN4mSZB/route-id.png)


## Görsel Yüklemek
Şimdiye kadar fotoğraların yalnızca ismini va açıklamalarını gönderdik, bu çalışma da ise fotoğrafın kendisini nasıl göndereceğimiz üzerine konuşacağız. Bunun için express-fileupload modülünü kullanacağız. Bu modülü indirelim.


```console
npm i express-fileupload
```  

Görseli göndermek için formumuzda ilgili input alanının, name="image" ve type="file" olduğuna dikkat ediniz. Ayrıca görsel göndermemiz için encType="multipart/form-data" eklememiz gerekir. Bundan sonra express-fileupload modülün de yardımıyla bundan sonra req.files.image nesnesi yardımıyla gönderilen görsel özelliklerine ulaşabiliriz. express-fileupload modülünü kullanmak için aşağıdaki işlemleri yapacağız.



```javascript
const fileUpload = require('express-fileupload'); // modülü kullanıma alıyoruz.
app.use(fileUpload());     
```  

Görsel Yükleme Aşamaları

- Biz görselleri uploads isimli bir klasöre yükleyeceğiz, öncelikle bu klasörün olup olmadığını kontrol edeceğiz.



```javascript
  const uploadDir = 'public/uploads';

  if (!fs.existsSync(uploadDir)) { // Bunun için const fs = require('fs'); almamız gerekir.
    fs.mkdirSync(uploadDir);
  }
```
- Sonra bu görselimizin kendisini ve yüklenmek istenen dosya yolunu yakalayalım.

```javascript
 let uploadeImage = req.files.image;
 let uploadPath = __dirname + '/public/uploads/' + uploadeImage.name;
```  

- Son olarak da bu bilgileri görsele ait diğer bilgiler ile birlikte veritabanına yazdıralım.

```javascript
 uploadeImage.mv(uploadPath, async () => {
    await Photo.create({
      ...req.body,
      image: '/uploads/' + uploadeImage.name,
    });
```
ilgili yönlendirmenin son hali aşağıdadır:

```javascript
app.post('/photos', async (req, res) => {
  //Eğer klasör yoksa oluşturacak
  const uploadDir = 'public/uploads';
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }
  // Yükeldiğimiz dosyayı yakalayıp isteiğimiz bilgileri değişkenleri aktarıyoruz
  let uploadeImage = req.files.image;
  let uploadPath = __dirname + '/public/uploads/' + uploadeImage.name;

  // Yakaladığımız dosyayı .mv metodu ile yukarda belirlediğimiz path'a taşıyoruz. Dosya taşıma işlemi sırasında hata olmadı ise req.body ve içerisindeki image'nin dosya yolu ve adıyla beraber database kaydediyoruz
  uploadeImage.mv(uploadPath, async (err) => {
    if (err) console.log(err);    // Bu kısımda önemli olan add.ejs'nin içerisine form elemanı olarak encType="multipart/form-data" atribute eklemek
    await photo.create({
      ...req.body,
      image: '/uploads/' + uploadeImage.name,
    });
  });
  res.redirect('/');
});
```

![site](https://i.ibb.co/x3RBZv6/imageupload1.gif)
﻿## Fotoğraf Bilgilerini Güncellemek
Bu bölümde yüklediğimiz fotoğraflara ait bilgileri nasıl güncelleyeceğimiz üzerine konuşacağız. Senaryomuz şu şekilde Update Details butonuna tıklandığında bir GET reguest sonucunda edit sayfası açılacak bu sayfada bulunan formda formlara ait olan önceki bilgiler bulunacak, bilgilerde bir değişiklik yaptığımızda sonrasında POST request yardımıyla güncellenmiş bilgilerle tekil fotoğraf sayfasına yöneleceğiz.



Update butonuna tıkladığımız zaman açılacak edit.ejs template'i add.ejs den faydalanarak oluşturacağız. Güncellenek Fotoğraf bilgisine ait olan _id yi de photo.ejs deki Update Details linkine `href="/photos/edit/<%= post._id %>"` de yakalıyoruz. İlgili yönlendirme de aşağıdaki gibi olacaktır.



```javascript
app.get('/photos/edit/:id', async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  res.render('edit', {
    photo,
  });
});
```  

Edit template sayfasına ulaştığımızda ise ilgili photo bilgisinin hali hazırda görünmesini istiyoruz. Bunun için form alanlarındaki value değerlerini görmemiz gerekir. Bunun için aşağıdaki kodları yazacağız edit template içerisindeki ilgili form alanlarına.



```html
<%= photo.title %>
<%= photo.description %>
```  

Böylelikle "GET" request aşaması tamamlanmış oldu. Şimdi ise yapmamız gereken değişen bu bilgileri "POST" request ile göndemek ancak değişen bilgileri göndermek için biz http PUT request kullanacağız. Tarayıcılar bu PUT requesti desteklemedikleri için yapacağımız PUT requesti tarayıcının anlayacağı POST request şeklinde simüle edeceğiz. Bunun için ise method-override modülünü kullanacağız.



```console
 npm i method-override
```
Bu metodu çağıracağız ve middleware olarak kayıt edeceğiz.



```javascript
 const methodOverride = require('method-override'); // Projemize dahil edelim
```  
```javascript
app.use(methodOverride('_method')); // MiddleWare olarak tanımlayalım
```  

edit template içerisindeki formumuzda POST requesti PUT requeste dönüştürmek için aşağıdaki düzenlemeyi yapacağız.



```html
form method="POST" action="/photos/<%= photo._id %>?_method=PUT"
```
Şimdi app.js içerisindeki bu PUT request yönlendirmesini yapacağız.


```javascript
app.put('/photo/:photo_id', async (req, res) => {
  const foundedPhoto = await photo.findByIdAndUpdate(req.params.photo_id);

  // Yeni fotoğrafı upload et
  let uploadeImage = req.files.image;
  let uploadPath = __dirname + '/public/uploads/' + uploadeImage.name;
  uploadeImage.mv(uploadPath, async (err) => {
    if (err) console.log(err);
    foundedPhoto.image = '/uploads/' + uploadeImage.name;
    foundedPhoto.title = req.body.title;
    foundedPhoto.description = req.body.description;
    foundedPhoto.save();
    res.redirect(`/photo/${req.params.photo_id}`);
  });
});
```

![site](https://i.ibb.co/fNT6381/Gif-Maker-20220420161615163.gif)
﻿## Fotoğraf Silmek
Eveeeettt, şimdiye kadar fotoğrafları yükledik, sıraladık ve güncelledik. Şimdi ise burada istediğimiz fotoğrafı nasıl sileceğimiz konusuna. Geçen çalışmamıza benzer bir şekilde burada DELETE request yapacağız ancak yine tarayıcılar tarafından `DELETE request` desteklenmeyeceği için bu kez POST requesti `DELETE request` olarak simüle edeceğiz.



Silme işlemini yaparken herhangi bir forma gerek olmadığı için bunu DELETE PHOTO butonuna link olarak ekleyeceğiz.


```htm
a href="/photos/<%= photo._id %>?_method=DELETE"
```


Bir fotoğrafı sildiğimizde ek olarak bu fotoğrafı fiziksel olarak da ilgili fotoğrafı silmek isteriz. Bunun için yine Node.js çekirdek modülü olan fs modülünden faydalanacağız. İlgili DELETE requeste ait olan yönlendirmeyi aşağıda bulabilirsiniz.




```javascript
app.delete('/photos/:id', async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  let deletedImage = __dirname + '/public' + photo.image;
  fs.unlinkSync(deletedImage);
  await Photo.findByIdAndRemove(req.params.id);
  res.redirect('/');
});
```  

İlgili fotoğrafı silmek için bir onaylama popup açmak istersek, aşağıdaki güncellemeyi yaparız.

```htm
<a href="/photos/<%= photo._id %>?_method=DELETE" class="btn btn-danger p-0 tm-btn-animate tm-btn-download tm-icon-download"
onclick="return confirm('ARE YOU SURE?')"><span>Delete Photo</span></a>
```
﻿## MVC Düzenlemesi

Projemizi incelediğimizde tüm yönlendirmelerimizi ve bu yönlendirmelere karşılık yapılan işlemlerin tamamını app.js dosyası içerisinde yapıyoruz. Açıkcası bizim projemizde şimdiye kadar bir sorun çıkmış değil. Ancak özellikle büyük ölçekli projelerin yönetimi ve hata yakalaması açısında kodu işlevsel açıdan farklı dosyalara bölmek işimizi kolaylaştırır. Burada biz MVC yapısını kullanacağız.

## MVC Nedir?

MVC - Model View Controller - uygulama kodunu Model, View ve Controller olmak üzere birbirine bağlı üç öğeye ayrılmasını içeren bir yazılım mimari yapısıdır.

Bir fotoğrafı sildiğimizde ek olarak bu fotoğrafı fiziksel olarak da ilgili fotoğrafı silmek isteriz. Bunun için yine Node.js çekirdek modülü olan fs modülünden faydalanacağız. İlgili DELETE requeste ait olan yönlendirmeyi aşağıda bulabilirsiniz.

- ### Model

Uygulamanın veri yapısını ve veri tabanı ile ilişkisini tanımlar. Schema "şablon" yapısı sayesinde veri özellikleri belirlenir.

- ### View

Uygulamanın son kullanıcılara görünen bölümünü temsil eder. Son kullanıcıya gösterilecek veri özelleştirilebilir.

- ### Controller

Son kullanıcıdan gelen isteklerin uygun View'e yönlendirilmesi kontrol edilir. İstek, cevap işleyicisi olarak da tanımlanır.



controllers/photoController.js dosyası oluşturup, app.js içerisindeki tüm yönlendirmeleri bu dosyaya taşıyalım. Yapılan tüm işlemlere özel fonksiyon isimleri tanımlanarak oluşturulan photoController.js dosyasının son hali aşağıdaki gibidir

`controllers/photoController.js`

```javascript
const photo = require('../models/Photo'),
  path = require('path'),
  fs = require('fs');

exports.getAllPhotos = async (req, res) => {
  const photos = await photo.find({});
  res.render('index', { photos });
};

exports.getPhotoPage = async (req, res) => {
  const foundedPhoto = await photo.findById(req.params.photo_id);
  res.render('photo', { photo: foundedPhoto });
};

exports.getEditPage = async (req, res) => {
  const foundedPhoto = await photo.findById(req.params.photo_id);
  res.render('edit', { photo: foundedPhoto });
};

exports.photoUpdate = async (req, res) => {
  const foundedPhoto = await photo.findByIdAndUpdate(req.params.photo_id);

  // Yeni fotoğrafı upload et
  let uploadeImage = req.files.image;
  let uploadPath = __dirname + '/../public/uploads/' + uploadeImage.name;
  uploadeImage.mv(uploadPath, async (err) => {
    if (err) console.log(err);
    foundedPhoto.image = '/uploads/' + uploadeImage.name;
    foundedPhoto.title = req.body.title;
    foundedPhoto.description = req.body.description;
    foundedPhoto.save();
    res.redirect(`/photo/${req.params.photo_id}`);
  });
};

exports.photoUpload = async (req, res) => {
  //Eğer klasör yoksa oluşturacak
  const uploadDir = 'public/uploads';
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }
  // Yükeldiğimiz dosyayı yakalayıp isteiğimiz bilgileri değişkenleri aktarıyoruz
  let uploadeImage = req.files.image;
  let uploadPath = __dirname + '/../public/uploads/' + uploadeImage.name;

  // Yakaladığımız dosyayı .mv metodu ile yukarda belirlediğimiz path'a taşıyoruz. Dosya taşıma işlemi sırasında hata olmadı ise req.body ve içerisindeki image'nin dosya yolu ve adıyla beraber database kaydediyoruz
  uploadeImage.mv(uploadPath, async (err) => {
    if (err) console.log(err); // Bu kısımda önemli olan add.ejs'nin içerisine form elemanı olarak encType="multipart/form-data" atribute eklemek
    await photo.create({
      ...req.body,
      image: '/uploads/' + uploadeImage.name,
    });
  });
  res.redirect('/');
};

exports.photoDelete = async (req, res) => {
  const foundedPhoto = await photo.findOne({ _id: req.params.photo_id });
  const imagepath = __dirname + '/../public' + foundedPhoto.image;
  fs.unlinkSync(imagepath);
  await photo.findByIdAndDelete(req.params.photo_id);
  res.redirect('/');
};
```

sonrasında bu oluşturulan fonksiyonlar app.js dosyasına çağırılır.

`app.js`
```javascript
const photoController = require('./controllers/photoControllers'); // en yukarıya yazılacak
//ROUTES
app.get('/', photoController.getAllPhotos);
app.get('/photo/:photo_id', photoController.getPhotoPage);
app.get('/photo/edit/:photo_id', photoController.getEditPage);
app.put('/photo/:photo_id', photoController.photoUpdate);
app.post('/photos', photoController.photoUpload);
app.delete('/photo/:photo_id', photoController.photoDelete);

```

Aynı işlemleri uygulamamızın sayfaları için de uygulayalım.  

`controllers/pageController.js`

```javascript

exports.getAboutPage = (req, res) => {
    res.render('about');
  }

exports.getAddPage = (req, res) => {
    res.render('add');
  }
```  


`app.js`
```javascript
const pageController = require('./controllers/pageController'); // Bu en yukarıya yazılacak

app.get('/about', pageController.getAboutPage);
app.get('/add', pageController.getAddPage);
```

﻿## Pagination (Sayfalama)

Uygulamamızın yavaş yavaş sonuna geliyoruz. Ama bir sorunumuz var, uygulamamıza yüklediğimiz tüm fotoğraflar anasayfada sıralanıyor. Fotoğraf sayımız arttığında sayfamızın aşağıya doğru uzadığını göreceğiz. Bunun önüne geçmek için farklı çözümler var biz bu çalışmamızda Pagination kavramı üzerine konuşacağız. Sayfalama özelliğine geçmeden önce req.query özelliği üzerine konuşmamız gerekir.

## req.query

req.query özelliği ile ilgili yönlendirmede bulunan sorgu parametrelerini yakalamamızı sağlar. URL de ?user=test&pass=1234 sorgusu yapıldığında req.query özelliği bize sorgu parametlerini ve değerlerini gösteren bir key - value objesi döner.  


`{ user: 'test', pass: '1234' }`  

Bu özellik sayesinde biz ne yapabiliriz? Eğer hangi sayfada olduğumuzu bir şekilde query ile yakaladığımızda biz sayfa içeriğimizi de o anda bulunan sayfaya göre belirleyebiliriz. Her sayfada bulunan içerik sayısını da belirledikten sonra her sayfaya hangi içeriğin düşeceğini belirleyebiliriz. Bu arada toplam fotoğraf sayımızı her sayfada bulunmasını istediğimiz fotoğraf sayısına bölersek toplam sayfa sayımız da ortaya çıkar. Nasıl karışık geldi değil mi?:)))  

Şimdi hemen ilgili kodumuzu yazalım ve ve yanlarına açıklamalarımızı koyalım.


`photoController.js`  
```javascript
exports.getAllPhotos = async (req, res) => {
  const page = req.query.page || 1  // urldeki parametreyi alıyoruz
  const photoPerPage = 2  // sayfa başına kaç fotoğraf olduğunu belirtiyoruz
  const totalPhotos = await photo.find().countDocuments();  // Database'de kayıtlı olan tüm fotoğrafların sayısını alıyoruz

  const photos = await photo.find({}) // Tüm fotoğrafları alıyoruz
    .sort('-dateCreated') // Yüklenme tarihine göre sıralıyoruz
    .skip( (page - 1) * photoPerPage )  // url'den aldığımız sayfa sayısından 1(bi önceki sayfa) çıkartıp, her sayfada kaç fotoğraf olacaksa onla çarpıyoruz
    .limit(photoPerPage); // Kaç adet veri gösterileceğini pelirtiyoruz

  res.render('index', { 
    photos: photos,
    page:page,
    totalPhotos: Math.ceil(totalPhotos  / photoPerPage )  // toplam fotoğraf sayısını, her sayfada gözükecek olan fotoğraf sayısına bölerek toplam sayfa sayınıaelde ediyoruz. ondalık sayı çıkarsa diye en yakın onluğa yuvarlıyoruz
   });
};
```

index.js sayfasındaki pagination kodu ise aşağıdadır.

`views/index.ejs`
```javascript
<!-- Catalog Paging Buttons -->
                    <div>
                        <% if (totalPage > 0 ) { %> <!-- Toplam sayfa sayısı 0'dan büyük ise aşağıdakileri yap -->
                            
                            <ul class="nav tm-paging-links">

                                <% for( let i = 1; i <= totalPage; i++ ) { %> <!-- Toplam sayfa sayfa sayısına ulaşana kadar sayfa butonunu 1 arttır-->
                                    <% if (currentPage == i ) { %> <!-- eğer ki url'deki sayfa saysı, for döngüsündeki sayısa eşit ise active class'lı olanı göster -->

                                            <li class="nav-item active"><a href="/?page=<%= i %>" class="nav-link tm-paging-link"><%= i %> </a></li>

                                    <% } else if ( i <= 18 ) { %>  <!-- Eğer şuan ki sayfa sayısı 18'den küçük veya eşit ise sadece 18 tane (sayfaya bu kadar sığıyor) sayfa numarası göster -->
                                        
                                            <li class="nav-item"><a href="/?page=<%= i %>" class="nav-link tm-paging-link"><%= i  %> </a></li>
                                        <% }  %>  
                                <% } %>
                                        <% if (currentPage < totalPage) { %> <!-- Eğer şuan ki sayfa toplam sayfa sayısından küçük ise sayfa butonlarının yanına last butonu koy-->
                                            
                                            <li class="nav-item"><a href="/?page=<%= totalPage %>"  class="nav-link tm-paging-link"> last </a></li>
                                        <% } %>
                            </ul>
                        <% } %>
                        
                    </div>

```
![alt](./public/video/pcat.gif)

## [Pcat Heroku Demo](https://pcat-heroku.herokuapp.com/)

## Heroku Deployment

Artık çalışmamızı tamamladık, şimdi ise en zevkli bölüm olarak çalışmamızı web ortamına yükleyelim. Aşağıdaki aşamaları teker teker belirteceğim.  

- ### Atlas Cloud

Atlas Cloud, mongoDB geliştiriceleri tarafından geliştirilen bir veritabanı bulut hizmetidir, https://account.mongodb.com/account/login?nds=true adresinden giriş yapıyoruz.


Atlas Cloud ortamında yeni bir proje ve veritabanımızı oluşturacağımız yeni bir Cluster oluşturalım.


- ### Heroku Platform

Heroku uygulamamıza barınma servisi sağlayacak bir bulut platformudur. Heroku ortamında yeni bir uygulama oluşturalım. Sonrasında ise bazı heroku komutlarını kullanmak için HEROKU CLI programını indirelim.

- Cluster oluşturulduktan sonra tüm IP lerden ulaşım hakkı sağlıyoruz. Veritabanı kullanıcısı ve şifreyi oluşturuyoruz ve sonrasında uygulamamızdan veritabanına ulamak için gerekli stringi kopyalayalım.
- mongoose.connect('mongodb den alınan string') metodu içerisine ilgili stringi yerleştiriyoruz
- uygulamamızda port değiken değerini değiştirelim. const port = process.env.PORT || 5000
- package.json dosyasında çalışma scripti olarak "start":"node app.js" oluşturalım.
- heroku ortamına gönderim için aşağıdaki koları yazacağız.

```console
heroku login

cd my-project/
git init
heroku git:remote -a uygulama_adı

$ git add .
$ git commit -am "make it better"
$ git push heroku master // Eğer daha öncesinde oluşturduysak -git push heroku main- yazmalıyız.
```
