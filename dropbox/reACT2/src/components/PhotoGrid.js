import React, { Component } from 'react'
import '../styles/photogrid.scss';
import gallery1 from '../images/gallery1.jpg'
import gallery2 from '../images/gallery2.jpg'
import gallery3 from '../images/gallery3.jpg'
import gallery4 from '../images/gallery4.jpg'
import gallery5 from '../images/gallery5.jpg'
import gallery6 from '../images/gallery6.jpg'
import gallery7 from '../images/gallery7.jpg'
import gallery8 from '../images/gallery8.jpg'
import gallery9 from '../images/gallery9.jpg'
import gallery10 from '../images/gallery10.jpg'
import gallery11 from '../images/gallery11.jpg'
import gallery12 from '../images/gallery12.jpg'
import gallery13 from '../images/gallery13.jpg'
import gallery14 from '../images/gallery14.jpg'
import gallery15 from '../images/gallery15.jpg'

import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';

/* eslint-disable */ 
export default class PhotoGrid extends Component{
    constructor(){
        super();
    }

    render(){
        const photos = [
            gallery1, gallery2, gallery3, gallery4,
            gallery5,  gallery6, gallery7, gallery8,
            gallery9,  gallery10, gallery11,gallery12,
            gallery13, gallery14, gallery15,
        ];

        const imageData = [
            { name: "Dice.png", size: "3 MB", photo: photos[0]},
            { name: "Ballroom.png", size: "13 MB", photo: photos[1]},
            { name: "Eat Outside.png", size: "10 MB", photo: photos[2]},    
            { name: "Bathroom.png", size: "3 MB", photo: photos[3]},    
            { name: "Bedroom.png", size: "9 MB", photo: photos[4]},    
            { name: "living room.png", size: "15 MB", photo: photos[5]},    
            { name: "Photo grid tour.png", size: "3 MB", photo: photos[6]},    
            { name: "Restaurant.png", size: "35 MB", photo: photos[7]},    
            { name: "Jeff's Sink.png", size: "3 MB", photo: photos[8]},    
            { name: "Master bedroom.png", size: "12 MB", photo: photos[9]},    
            { name: "Moms living.png", size: "30 MB", photo: photos[10]},
            { name: "Dining room.png", size: "12 MB", photo: photos[11]},
            { name: "Mollys room.png", size: "30 MB", photo: photos[12]},
            { name: "rings.png", size: "5 MB", photo: photos[13]}
        ];

        let images = imageData.map((item, index) => {
            return(
                <GridTile
                    className="photo-container"
                    key={index}
                    title={item.name}
                    subtitle={item.size}
                    actionIcon={<IconButton><StarBorder color="white"/></IconButton>}
                >
                    <img src={item.photo} alt={item.name}/>
                </GridTile>
            )
        });

        return(
            <section id="photo-grid" className="row">
                <GridList
                    cellHeight={280}
                >
                {images}
                </GridList>
            </section>
        )
    }
}
