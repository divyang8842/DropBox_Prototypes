import React, {Component} from 'react';
import Group from "./Group";


class UserGroup extends Component {

    state = {
        groupInfo :[],
        groupMembers : [],
        groupName:''
    };

    getHome =() =>{
        this.props.getToHome();
    };
    getUserProfile =()=>{
        this.props.goToPath('/userprofile');
    };


    goToPath = (path) =>{
        this.props.goToPath(path);
    };
    getUserLogs =() =>{
        this.props.goToPath('/useractivity');
    };
    signout = () => {
        this.props.signout();
    };

    setUserGroup = (groupData) => {
        API.setUserGroup(groupData)
            .then((status) => {
                if (status === 200) {
                    alert("Group saved successfully.");
                } else if (status === 401) {
                    alert("Error while saving user group.");
                }
            });
    };

    componentWillMount(){
        var userid = localStorage.getItem('token');
        var data = {'userid':userid};
        API.getUserGrpups(data).then((resData) => {
            // alert("data is "+JSON.stringify(resData));
            if (resData.status == 201) {
                this.setState({
                    groupInfo :resData.groups,
                    groupName : '',
                    groupMembers : []
                })
            }else if(resData.status==501){
                localStorage.removeItem("token");
                localStorage.removeItem("root");
                this.getHome();
            }
        });
    };

    render() {
        //console.log(this.props);
        return (


            <div className="container-fluid">
                <NavBar goToPath={this.goToPath} page = {"usergroup"} getUserLogs={this.getUserLogs} getUserProfile={this.getUserProfile}  getHome={this.getHome} shareFile={this.getHome}   signout= {this.signout}></NavBar>


                <div className="row justify-content-md-center">
                    <div className="col-md-6">
                        <h2 className="text-center">My Todos</h2>
                    </div>

                </div>
                <hr/>
                <div className="row justify-content-md-center">
                    <div className="col-md-6">
                        <div className="form-group">
                            <input
                                className="form-control"
                                ref={(input) => this.input = input}
                                type="text"
                                placeholder="Enter a Todo"
                            />
                        </div>
                        <button
                            className="btn btn-primary btn-sm"
                            onClick={() => {
                                this.props.addTodo(this.input.value)
                            }}
                        >Add</button>
                    </div>
                </div>

                <hr/>
                <div className="row justify-content-md-center">
                    <div className="card col-md-6">
                        <div className="card-body">
                            {
                                this.state.groupMembers.map((todo,index) => {
                                    return(
                                        <TodoItem
                                            key={index}
                                            item={todo}
                                        />
                                    );
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(UserGroup);
