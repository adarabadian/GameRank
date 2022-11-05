import React from "react";
import { Review } from "../../../../Models/Review";
import './GameReview.css';

export default function GameReview(props: any) {
    const review : Review = props;

    return (
        <div className="review">
            <div className="reviewHeader">
                <div className="reviewLeft">
                    <h2>{review.title}</h2>
                    <p>{review.description}</p>
                </div>
                <div className="reviewRight">
                    <p>{review.reviewer}</p>
                    <p>{review.date}</p>
                    <h3 className="reviewScoreColorful">Score: {review.score}</h3>
                </div>
            </div>

            <hr></hr>
        </div>
    );
}
