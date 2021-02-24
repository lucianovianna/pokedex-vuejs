import getPokemons from './getPokemons';

export default class {
    constructor(nome, url) {
        this.nome = nome;
        this.url = url;

        this.data = false;
        this.image = '';
    }

    getData() {
        console.log('Chegou no data');
        // evita que a função seja chamada muitas vezes
        this.data = true;

        getPokemons.getPokemonData(this.url).then((res) => {
            this.data = res.data;
        }).catch((err) => {
            console.log(err);
        }).then(() => {
            /* Define os valores necessários */ 
            this.image = this.data.sprites.front_default;
        });
    }

    getImage() {
        if (this.data == '' && !this.data) this.getData();

        return this.image;
    }
}