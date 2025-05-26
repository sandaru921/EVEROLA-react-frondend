import React from "react";

export const PrimaryButton = ({label, type}) => {
    switch (type) {
        case 'submit': 'btn-signup';
    }

    return (
        <button type="submit" className="btn-signup">
            {label}
        </button>
    )
}