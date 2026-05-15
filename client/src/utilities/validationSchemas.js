// Validation rules for forms

export const billingValidationRules = {
    fullName: {
        required: {
            value: true,
            message: "Full Name is required",
        },
        minLength: {
            value: 5,
            message: "Minimum length is 5 characters",
        },
    },
    phone: {
        required: {
            value: true,
            message: "Phone is required",
        },
        pattern: {
            value: /^(010|011|012|015)\d{8}$/,
            message: "Phone must start with 010, 011, 012, or 015 and be 11 digits total",
        },
    },
    governorate: {
        required: {
            value: true,
            message: "Governorate is required",
        },
        maxLength: {
            value: 5,
            message: "Maximum length is 5 characters",
        },
    },
    city: {
        required: {
            value: true,
            message: "City is required",
        },
    },
    street: {
        required: {
            value: true,
            message: "Street is required",
        },
    },
    notes: {
        minLength: {
            value: 10,
            message: "Minimum length is 10 characters",
        },
    },
};
