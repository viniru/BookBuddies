import React, { Component } from 'react';


class BookListElement extends Component {

    state = {
        u_id : this.props.u_id,
        b_id : this.props.b_id,
        comments: [],
        loaded : false,
        typedComment: "",
        triedPosting : false
     }


     componentDidMount() {
       fetch('http://localhost:5000/user/getcomments',
          {
            method : "post",
            mode : "cors",
            body : JSON.stringify({
              b_id : this.state.b_id
            }),
            headers: {
               'content-Type': 'application/json'
           }
         })
         .then(response => response.json()
         .then(comments => {
           this.setState( {comments, loaded : true} );
         }));
     }


     handlePost = () => {
       if(!this.state.u_id) {
            this.setState({triedPosting : true});
       }
       else {
         let comment = [
           {
             u_id : this.state.u_id,
             b_id : this.state.b_id,
             comment_date : new Date(),
             username : "yourname",
             title : this.state.typedComment
           }
         ]

         let comments = [comment, ...this.state.comments]
         this.setState({comments});

         fetch('http://localhost:5000/book/addcomment',
            {
              method : "post",
              mode : "cors",
              body : JSON.stringify({
                u_id : this.state.u_id,
                b_id : this.state.b_id,
                title : this.state.typedComment
              }),
              headers: {
                 'content-Type': 'application/json'
             }
           })
           .then(response => response.json()
           .then(comments => {
             this.setState( {comments, typedComment:""} );
           }));
        }

     }



     handleChange = event => {
       this.setState({typedComment : event.target.value});
     }

     handleDelete = c_id => {
         fetch('http://localhost:5000/book/deletecomment',
            {
              method : "post",
              mode : "cors",
              body : JSON.stringify({
                b_id : this.state.b_id,
                c_id : c_id
              }),
              headers: {
                 'content-Type': 'application/json'
             }
           })
           .then(response => response.json()
           .then(comments => {
             this.setState( {comments} );
           }));
     }


    render() {

      const plsLogIn = <div className="alert alert-danger alert-dismissible">
                          <button type="button" className="close" data-dismiss="alert">&times;</button>
                          <strong>Session not found!</strong> Please log in to comment.
                        </div>;

      const commentBox = <div>
                            <textarea
                            className="form-control"
                            placeholder="Write a comment..."
                            rows="3"
                            value={this.state.typedComment}
                            onChange={this.handleChange}
                            />
                            <br/>
                            <button
                            type="button"
                            className="btn btn-info pull-right"
                            onClick={this.handlePost}>Post
                            </button>
                            <div className="clearfix"></div>
                          </div>;

        return (
          <div className="container">
          {this.state.triedPosting ? plsLogIn : null}
              <div className="row">
                    <div className="col-md-10 col-md-offset-2 col-sm-12">
                        <div className="comment-wrapper">
                            <div className="panel panel-info">
                                <div className="panel-heading">

                                    <h3 className="text-center">Comments  <i className="fa fa-comments ml-2 mr-2" />({this.state.comments.length})</h3><hr/>
                                </div>
                                <div className="panel-body">
                                    {commentBox}
                                    <hr/>
                                    <ul className="media-list">
                                      {this.state.loaded ? this.state.comments.map( (comment,index) =>
                                        <div><li key={index} className="media mb-4">

                                            <div className="media-body">
                                                <span className="text-muted pull-right">
                                                    <small className="text-muted">{comment.comment_date}</small>
                                                </span>
                                                <strong className="text-success">@{comment.username}</strong>
                                                <p>{comment.title}</p>
                                            </div>
                                            {this.state.u_id === comment.u_id ?
                                            <button
                                            type="button"
                                            className="btn btn-danger btn-sm mt-4"
                                            onClick = {() => this.handleDelete(comment.c_id)}
                                            >
                                            <i className="fa fa-trash"/>
                                            </button> : null}
                                        </li>
                                        <hr/>
                                        </div>
                                      ): "Loading..."}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
          </div>
          );
    }
}

export default BookListElement;
