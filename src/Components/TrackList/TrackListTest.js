import React from 'react';
import './TrackList.css';
import Track from '../Track/Track';

class TrackList extends React.Component{
  render(){
    return(
      <div className="TrackList">
          {/*You will add a map method that renders a set of Track components  */}
          {this.props.tracks.map(track=>{
            return(
              <div className="Track" key={track.id}>
                <div className="Track-information">
                  <h3>{track.name}</h3>
                  <p>{track.artist} | {track.album}</p>
                </div>
                <a className="Track-action">+</a>
              </div>
            );
          })}
      </div>
    );
  }
}

export default TrackList;
