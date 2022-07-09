var express = require('express');
var router = express.Router();
const axios = require('axios').default;

const fs = require('fs');
const { renderContent, pdfMaker } = require('../services/pdf.service');

const POKEAPI = 'https://pokeapi.co/api/v2/pokemon';

router.get('/', async (req, res, next) => {
    const page = req.query.page != undefined ? req.query.page : 0;  
    const limit = req.query.limit != undefined ? req.query.limit : 0;  ;     
    const search = req.query.search;     
    
    let url = POKEAPI;
    let isRequestValid = true;
    
    let offset = 0;
    if (page > 1) offset = (page-1) * limit;
    
    if (page > 0 & limit > 0) url += `?offset=${offset}&limit=${limit}`;
    else if (limit > 0) url += `?limit=${limit}`;
    
    let pokemons = null;
    pokemons = await axios.get(url).then(res => res.data);
    let result = [];
    if (search != undefined) {        
        result = pokemons.results.filter( item => item.name.includes(search) );
    }
    pokemons.results = result;
    pokemons.results.sort( (a,b) => a.name.localeCompare( b.name ) );

    if (isRequestValid) {
        res.status(200).json({
            pokemons
        });
    } else {
        res.status(400).json({
            message: "Los parámetros ingresados no son válido..."
        });
    }
});

router.post('/', async (req, res, next) => {
    const name = req.body.name;    
    let url = POKEAPI + '/' + name;
    const response = await axios.get(url)
        .then(res => res.data)
        .catch(err => err.response.status);    
    
    if (response != 404) {
        pdfMaker(renderContent(name, response));
        const path = './pdf/pdfPokemon.pdf';
        if (fs.existsSync(path)) {
            res.contentType("application/pdf");
            fs.createReadStream(path).pipe(res);
        } else {
            res.status(500);
            console.log('File not found');
            res.send('File not found');
        }
    }
    else res.status(response).json({ message:"No se encontraron resultados..." });
    
});

module.exports = router;
