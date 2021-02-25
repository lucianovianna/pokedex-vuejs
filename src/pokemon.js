import getPokemons from './getPokemons';

export default class {
    constructor(nome, url) {
        this.nome = nome;
        this.url = url;

        this.data = false;
        
        this.image = '';
        this.id = 0;
    }

    getData() {
        // evita que a função seja chamada muitas vezes
        this.data = true;
        console.log('Chegou no getData()');

        getPokemons.getPokemonDataByUrl(this.url).then((res) => {
            this.data = res.data;
        }).catch((err) => {
            console.log(err);
        }).then(() => {
            /* Define os valores necessários */ 
            this.image = this.data.sprites.front_default;
            this.id = this.data.id;
        });
    }

    getImage() {
        if (!this.data) this.getData();

        return this.image;
    }

    getId() {
        if (!this.data) this.getData();

        return this.id;
    }
}