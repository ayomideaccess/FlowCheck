import { success, ZodError } from "zod";

const validate = (schema, source = "body" ) => {
    return (req, res, next) =>{
        try {
            const result = schema.parse(req[source]);
            if (source === "query") {
                req.validatedQuery = result;
            } else {
                req[source] = result;
            }
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    success: false,
                    errors: error.issues.map((issue) => ({
                        field: issue.path.join("."),
                        message: issue.message
                    }))
                })
            }
            next(error);
        }
    }
}
export default validate;