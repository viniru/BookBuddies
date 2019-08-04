import React, {useState} from 'react'
import {List, Header, Rating} from "semantic-ui-react";

export const Genres = ({genres}) => {
    

    return (
        <List>
            {genres.map(genre => {
                return (
                    <List.Item key={genre}>
                        <Header>{genre}</Header>
                        <Rating rating ={3.4} maxRating = {5} ></Rating>
                    </List.Item>
                )
            })}
        </List>
    )
};