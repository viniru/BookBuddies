import React, {useState} from 'react'
import {Form,Input, Rating, Button} from 'semantic-ui-react'

export const GenreForm = () => {
const [genre, setGenre]  = useState('')
const [rating, setRating] = useState([1]);

    return (
        <Form>

            <Form.Field>
                <Input value = {genre}
                placeholder="genre name"
                onChange={e => setGenre(e.target.value)} />
            </Form.Field>

        <Form.Field>
            <Rating icon='star'  value={rating} maxRating={5} onRate={(_,data) => {
                console.log(data)       
            }} />
        </Form.Field>
        <Form.Field>
            <Button onClick={async() => {
                const response = await fetch('/genre/add' , {
                    method: "POST",
                    headers: {
                        'content-Type': 'application/json'
                    },
                    body: JSON.stringify({genre})
                })

                if(response.ok){
                    console.log('response worked')
                } else{
                    console.log('response did not work')
                }
            }}>submit</Button>
        </Form.Field>
        </Form> 
    )
}