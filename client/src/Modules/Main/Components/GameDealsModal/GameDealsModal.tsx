import Modal from 'react-modal';
import "./GameDealsModal.css";
import React, { useState } from "react";
import { Game } from "../../../../Models/Game";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import { Box, MenuItem, Select } from "@material-ui/core";
import GameDeals from "../GameDeals/GameDeals";

Modal.setAppElement("#root");

export default function GameDealsModal(props: Game) {
    const game : Game = props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [platform, setPlatform] = useState("PC");

    function handleFirstClick() {
        let platformsCount = 0;

        if (game.isPc) {
            platformsCount++;
        }
        if (game.isPs) {
            platformsCount++;
        }
        if (game.isXbox) {
            platformsCount++;
        }

        if (platformsCount == 1) {
            openModal();
        } else {
            setIsDialogOpen(true);
        }
    }

    function openModal() {
        setIsDialogOpen(false);
        setIsModalOpen(true);
    }

    function closeModal() {
        setIsModalOpen(false);
    }

    const customStyles = {
        content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
        },
    };
    
    return (
        <div id="gameDealsModal">
            <button onClick={handleFirstClick}>Get best deals!</button>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                style={customStyles}
            >
                    <Box>
                        <IconButton onClick={()=> setIsModalOpen(false)}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                <GameDeals {...{game:game, platform:platform}}/>
            </Modal>

            <Dialog open={isDialogOpen} id="selectPlatformDialog">
                <div id="dialogHeaderContainer">
                    <h3>Choose platform</h3>

                    <Box>
                        <IconButton onClick={()=> setIsDialogOpen(false)}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </div>

                <Select
                    className='platformSelect'
                    labelId="Select-Platform"
                    value={platform}
                    label={platform}
                    onChange={(e: any) => {
                        setPlatform(e.target.value);
                    }}
                >
                    {game.isPc && <MenuItem value={"PC"}>PC</MenuItem>}
                    {game.isXbox && <MenuItem value={"Xbox"}>Xbox</MenuItem>}
                    {game.isPs && <MenuItem value={"PS"}>PlayStation</MenuItem>}
                </Select>

                <button onClick={openModal} id="dialogButton">
                    Get deals!
                </button>
            </Dialog>
        </div>
    );
}
