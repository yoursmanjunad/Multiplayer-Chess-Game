const express= require('express');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs'); 
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));
app.get('/',function(req,res){
    fs.readdir(`./files`, function(err,files){
        if(err){
            console.log(err);
        }else{
            res.render('index.ejs',{files:files});
        }
    }
    );});
app.post('/create',function(req,res){
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`, req.body.details, function(err){
        if(err){
            console.log(err);
        }else{
            res.redirect('/');
        }
    });
});
app.get('/files/:filename', function(req,res){
    fs.readFile(`./files/${req.params.filename}`, 'utf8', function(err,data){
        res.render('show.ejs', {data:data,filename:req.params.filename});
    })})
app.get('/edit/:filename', function(req,res){
    res.render('edit.ejs', {filename:req.params.filename});
})          
app.listen(3000, function(){
    console.log('Server started on http://localhost:3000');
}   );