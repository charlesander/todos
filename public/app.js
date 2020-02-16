import React, {Component}  from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import * as serviceWorker from './serviceWorker';

class App extends Component {

    /**
     * Hold the state of the App.
     * When variables in state are changed, the changes are automatically applied to the DOM by React:
     * todos: the original list of downloaded todos
     * todosSearch: the list of downloaded todos, filtered to only contain those that match the search
     * users: the original list of downloaded users
     * searchTearm: tracks the current search term
     * @type {{todos: Array, todosSearch: Array, users: Array, searchTerm: string}}
     */
    state = {
        todos: [],
        todosSearch: [],
        users: [],
        searchTerm: "",
    }

    /**
     * On initalization, load the todos and users into state
     */
    componentWillMount() {
        this.getTodos()
            .then(this.getUsers())
    }

    /**
     * read the todos and put them into state as todosSearch and todos
     * @returns {Promise.<TResult>|*|any|Promise<U>|never}
     */
    getTodos() {
        return axios.get('https://jsonplaceholder.typicode.com/todos').then((response) => {

            let todos = response.data;
            this.setState({
                todosSearch: todos,
                todos: todos
            })
        });
    }

    /**
     * read the users and put them into state
     */
    getUsers() {
        axios.get('https://jsonplaceholder.typicode.com/users').then((response) => {
            this.setState({
                users: response.data
            })
        });
    }

    /**
     * In the listing of todos, highlight parts of the todo's title that matches the search term
     * @param title
     * @returns {{__html: *}}
     */
    createSearchHighlighting(title) {

        let titleSearchHighlighted = title;
        if (this.state.searchTerm.length > 0) {
            titleSearchHighlighted = titleSearchHighlighted.replace(
                new RegExp(this.state.searchTerm, 'g'),
                '<span class="searchHighlight">' + this.state.searchTerm + '</span>'
            );
        }

        return {__html: titleSearchHighlighted};
    }

    /**
     *
     * @param event
     */
    search(event) {

        this.setState({
            searchTerm: event.target.value
        });

        let todos = this.state.todos.filter(function (todo) {
            return todo.title.includes(event.target.value)
        });
        this.setState({
            todosSearch: todos
        });
    }

    /**
     *
     * @param id
     */
    deleteTodo(id) {

        let todos = this.state.todosSearch.filter(function (todo) {
            return todo.id !== id
        });
        let todosBackup = this.state.todos.filter(function (todoBackup) {
            return todoBackup.id !== id
        });
        this.setState({
            todosSearch: todos,
            todos: todosBackup
        });
    }

    /**
     * Provide html for presenting the list of todos
     * @returns {Array}
     */
    formatTodosListing() {
        let todos = this.state.todosSearch.map((todo) => {

            var user = this.state.users.find(function (user) {
                return user.id === todo.userId;
            });

            todo.userName = (user && user.name) ? user.name : "Unknown";

            return (
                <tr key={todo.id}>
                    <th>{todo.id}</th>
                    <th>{todo.userName}</th>
                    <th dangerouslySetInnerHTML={this.createSearchHighlighting(todo.title)}></th>
                    <th>{todo.completed ? "Yes" : "No"}</th>
                    <th>
                        <button className="btn btn-danger"
                                onClick={this.deleteTodo.bind(this, todo.id)}>Delete
                        </button>
                    </th>
                </tr>
            )
        });
        return todos;
    }

    /**
     *
     * @returns {XML}
     */
    render() {

        let todos = this.formatTodosListing();

        return (

            <div className="App container">

                <input type="text" placeholder="Search" onChange={this.search.bind(this)}/>
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>User</th>
                        <th>Title</th>
                        <th>Completed</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {todos}
                    </tbody>
                </table>
            </div>
        );
    }
}

//export default App;

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
