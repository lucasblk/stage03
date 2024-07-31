import { GithubUser } from "./GithubUser.js"

export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root)
        this.load()
        this.tbody = this.root.querySelector('table tbody')
    }

    load() {
        this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []

        console.log(this.entries)
    }

    save() {
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
    }

    async add(username) {
        try {
            const userExist = this.entries.find(entry => entry.login === username)

            if(userExist) {
                throw new Error('Usuario ja cadastrado!')
            }


            const user = await GithubUser.search(username)
            console.log(user)
            if(user.login === undefined) {
                throw new Error('Usuario nao encontrado!')
            }
        
            this.entries = [user, ...this.entries]
            this.update()
            this.save()
        } catch(error) {
            alert(error.message)
        }
    }

    delete(user) {
        const filteredEntries = this.entries.filter(entry => entry.login !== user.login)

        this.entries = filteredEntries
        this.update()
        this.save()
    }
} 

export class FavoritesView extends Favorites {
    constructor(root) {
        super(root)
        this.update()
        this.onadd()
    }

    onadd() {
        const addButton = this.root.querySelector('.search button')
        addButton.onclick = () => {
            const { value } = this.root.querySelector('.search input')
            this.add(value)
        }
    }


    update() {
        this.removeAllTr()

        this.entries.forEach(user => {
            const row = this.createRow()
            row.querySelector('.user img').src = `https://github.com/${user.login}.png`

            row.querySelector('.user p').textContent = user.name

            row.querySelector('.user img').alt = `Imagem de ${user.name}`

            row.querySelector('.user span').textContent = user.login

            row.querySelector('.repositories').textContent = user.public_repos

            row.querySelector('.followers').textContent = user.followers

            row.querySelector('.remove').onclick = () => {
                const isOk = confirm('Deseja realmente apagar essa linha?')

                if(isOk) {
                    this.delete(user)
                }
            }


            this.tbody.append(row)
        })
        }

    createRow() {
        const tr = document.createElement('tr')

        tr.innerHTML = `<td class="user">
                        <img src="https://github.com/lucasblk.png" alt="Imagem do Usuario">
                        <div>
                            <p>Lucas Black</p>
                            <a href="https://github.com/lucasblk" target="_blank"><span>lucasblk</span></a>
                        </div>
                    </td>
                    <td class="repositories">
                        14
                    </td>
                    <td class="followers">
                        0
                    </td>
                    <td>
                        <button class="remove">&times;</button>
                    </td>`;
        
        return tr
        
    }
    removeAllTr() {
        

        this.tbody.querySelectorAll('tr').forEach((tr) => {
            tr.remove()
        });
    }
    }
