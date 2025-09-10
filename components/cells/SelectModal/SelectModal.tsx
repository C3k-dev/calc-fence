import { useModal } from '@/components/modal/ModalContext';
import React from 'react'

function SelectModal() {
    const { showModal } = useModal();

    return (
        <button
            onClick={() =>
            showModal({
            content: (
                <div>
                <p>Это любая модалка, которую можно вызвать из любого места</p>
                </div>
            ),
            onClose: () => console.log("Модалка закрыта"),
            })
        }
        >
            Выбрать
        </button>
    )
}

export default SelectModal