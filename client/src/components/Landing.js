import React, {Component} from 'react';


class Landing extends Component {
    
    renderBottom() {
        let bottomHeadings = [];
        for(let x=0; x<3; x++){
            bottomHeadings[x] = 
                <div key={x} className="col-md-4">
                    <h2>Heading</h2>
                    <p>Donec id elit non mi porta gravida at eget metus. 
                        Fusce dapibus, tellus ac cursus commodo, tortor 
                        mauris condimentum nibh, ut fermentum massa justo 
                        sit amet risus. Etiam porta sem malesuada magna 
                        mollis euismod. Donec sed odio dui.</p>
                    <p>
                        <a className="btn btn-default" href="/" role="button">View details »</a>
                    </p>
                </div>;
        }
        return bottomHeadings;
    }
    render() {
        return (
            <div>
                <div className="jumbotron text-center">
                    <h1>React Boilerplate</h1>
                    <p>React, Redux, Node, Express, Mongo, Sass, Bootstrap, Basic Authentication</p>
                    <p><a className="btn btn-primary btn-lg" href="https://github.com/hutchgrant/react-boilerplate" role="button">Learn more</a></p>
                </div>
                <div className="row">
                    {this.renderBottom()}
                </div>
            </div>
        );
    }
};

export default Landing;