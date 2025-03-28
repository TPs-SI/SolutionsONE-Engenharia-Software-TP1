/* eslint-disable @typescript-eslint/prefer-as-const */
import "./Style/ItemUsuario.css";
import { useNavigate } from "react-router-dom";
import api from "../Services/api";
import { useState } from "react";
import { Snackbar, Alert, Modal, Box } from "@mui/material";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 350,
  height: 260,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2.5,
  outline: 0,
};

function ItemUsuario({
  name,
  email,
  status,
  cargo,
  id,
  
}: {
  name: string;
  email: string;
  status: string;
  cargo: string;
  id: number;
}) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleDelete = () => {
    api
      .delete(`/users/admin/remove/${id}`)
      .then(() => {
        navigate(0);
        setOpen(true);
      })
      .catch((err) => {
        setErrorMessage("Erro ao deletar usuário");
        console.error(err);
        setOpen(true);
      });
  };

  const handleClose = () => {
    setOpen(false);
  };

  function changeUser() {
    navigate(`/usuario/${id}`);
  }

  //Modal

  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);


  return (
    <>
      <div className="item-div-usuario">
        <div className="item-info">
          <div className="item-name">
            <p>{name}</p>
          </div>
          <div className="item-email">
            <p>{email}</p>
          </div>
          <div className="aux-status-cargo">
            <div className="item-status">
              <p>{status + " "} </p>
            </div>
            <div className="item-cargo">
              <p>{cargo}</p>
            </div>
          </div>
        </div>
        <div className="icons-div">
          <div className="edit-icon" onClick={() => changeUser()}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_16_32)">
                <path
                  d="M2.5 14.375V17.5H5.625L14.8417 8.28333L11.7167 5.15833L2.5 14.375ZM17.2583 5.86666C17.5833 5.54166 17.5833 5.01666 17.2583 4.69166L15.3083 2.74166C14.9833 2.41666 14.4583 2.41666 14.1333 2.74166L12.6083 4.26666L15.7333 7.39166L17.2583 5.86666Z"
                  fill="#F9A006"
                />
              </g>
              <defs>
                <clipPath id="clip0_16_32">
                  <rect width="20" height="20" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
          <div className="thrash-icon" onClick={handleOpenModal}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_16_35)">
                <path
                  d="M5.00008 15.8333C5.00008 16.75 5.75008 17.5 6.66675 17.5H13.3334C14.2501 17.5 15.0001 16.75 15.0001 15.8333V5.83333H5.00008V15.8333ZM15.8334 3.33333H12.9167L12.0834 2.5H7.91675L7.08342 3.33333H4.16675V5H15.8334V3.33333Z"
                  fill="#E60B82"
                />
              </g>
              <defs>
                <clipPath id="clip0_16_35">
                  <rect width="20" height="20" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h3 className="deleteModal-title">Excluir usuário</h3>
          <p className="deleteModal-text">
            Tem certeza que deseja excluir o usuário {name}?
          </p>
          <div className="deleteModal-btns">
            <button className="deleteModal-cancel" onClick={handleCloseModal}>
              Cancelar
            </button>
            <button className="deleteModal-delete" onClick={handleDelete}>
              Excluir
            </button>
          </div>
        </Box>
      </Modal>

      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={errorMessage ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {errorMessage ? errorMessage : "Usuário deletado com sucesso!"}
        </Alert>
      </Snackbar>
    </>
  );
}

export default ItemUsuario;
