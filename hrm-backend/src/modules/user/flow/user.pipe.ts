import * as Joi from 'joi';

import { JoiValidationPipe } from '../../common';
import { Role, UserStatus } from '../../common/utils';
import { UserInput } from '../model';

const uuidArraySchema = Joi.string()
    .optional()
    .custom((value, helpers) => {
        try {
            // Parse the string as JSON
            const parsed = JSON.parse(value);
            // Check if parsed value is an array
            if (!Array.isArray(parsed)) {
                return helpers.error('string.invalidJsonArray');
            }
            // Validate each item in the array as a UUID
            for (const item of parsed) {
                if (
                    !Joi.string()
                        .uuid({ version: ['uuidv4'] })
                        .validate(item).error
                ) {
                    continue;
                }
                return helpers.error('string.invalidUuid');
            }
            return value; // Return original string if valid
        } catch (e) {
            return helpers.error('string.invalidJson');
        }
    })
    .messages({
        'string.invalidJson': 'observationArea must be a valid JSON string',
        'string.invalidJsonArray': 'observationArea must represent a JSON array',
        'string.invalidUuid': 'observationArea must contain valid UUIDs',
    });

export class UserInputPipe extends JoiValidationPipe {
    public buildSchema(): Joi.Schema {
        return Joi.object<UserInput>({
            username: Joi.string().required(),
            company: Joi.string().allow('').optional(),
            department: Joi.string().allow('').optional(),
            role: Joi.string()
                .valid(...Object.values(Role))
                .optional(),
            status: Joi.string()
                .valid(...Object.values(UserStatus))
                .optional(),
            observationArea: uuidArraySchema,
            email: Joi.string().email().required(),
            name: Joi.string().optional(),
            position: Joi.string().allow('').optional(),
        });
    }
}

export class UserUpdatePipe extends JoiValidationPipe {
    public buildSchema(): Joi.Schema {
        return Joi.object<UserInput>({
            username: Joi.string().optional(),
            company: Joi.string().allow('').optional(),
            department: Joi.string().allow('').optional(),
            role: Joi.string()
                .valid(...Object.values(Role))
                .optional(),
            status: Joi.string()
                .valid(...Object.values(UserStatus))
                .optional(),
            observationArea: uuidArraySchema,
            email: Joi.string().email().optional(),
            name: Joi.string().optional(),
            position: Joi.string().allow('').optional(),
        });
    }
}
