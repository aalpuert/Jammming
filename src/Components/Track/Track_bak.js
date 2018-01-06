import React from 'react';
import './Track.css';

class Track extends React.Component{
  constructor(props){
    super(props);
    this.addTrack = this.addTrack.bind(this);
  }

  addTrack(){
    this.state.playlistTracks.push(this.props.track);
  }

  renderAction(isRemoval){
    let expand = isRemoval?'-':'+';
    return expand;
  }

  render(){
    return (
      <div className="Track">
        <div className="Track-information">
          <h3>{/*track name*/}</h3>
          <p>{/*track artist*/} | {/*track album*/}</p>
        </div>
        <a className="Track-action" onClick={this.addTrack}>{/*track action*/}</a>
      </div>
    );
  }
}

export default Track;
