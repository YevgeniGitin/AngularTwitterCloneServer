import joi from 'joi';
const passwordschema = joi.string().regex(/^(?=.*?[A-Z])(?=.*?[0-9]).{8,}$/);
const inputchema = joi.string().min(1).max(240);
export { passwordschema, inputchema };
