import getPokemons from './getPokemons';

export default class {
    constructor(nome, url) {
        this.nome = nome;
        this.url = url;

        this.data = '';
        this.image = '';
    }

    getData() {
        console.log('chegou no getData()');
        getPokemons.getPokemonData(this.url).then((res) => {
            this.data = res.data;
        }).catch((err) => {
            console.log(err);
        }).then(() => {
            this.image = this.data.sprites.front_default;
        });
    }

    getImage() {
        if (this.data == '') this.getData();

        return this.image;
    }
}