# APIStoryAI Collection Generator

**APIStoryAI Collection Generator** is a CLI tool designed to generate a `collection.json` file from any schema file written in any language. (e.g., SQLAlchemy models). It utilizes OpenAI's GPT-4 to dynamically create API endpoints based on the database schema provided. This is useful for developers who want to quickly scaffold an API collection to use in their projects, saving time and effort.

## Features

- Automatically generates `collection.json` from a database schema written in any programming language; for the example here we used `schema.py` written in python.
- Integrates with OpenAI to ensure accurate and detailed API specification generation.
- Supports common API patterns like `GET`, `POST`, `PUT`, and `DELETE`.
- Outputs a JSON file with API endpoints, descriptions, and request formats.

## Installation

To install and set up the package, follow these steps:

1. **Initialize npm if you havent already via npm**:

```bash
npm init --y
```

2. **Install via npm**:

```bash
npm i apistoryai-generate-collection
```

## Usage

## Saving OpenAI API Key in System Path

Before using the package, you need to save your OpenAI API key in your system's environment variables. This allows the package to access the OpenAI API.

> For macOS/Linux:

1. Open your terminal.

2. Run the following command to add your API key to your shell configuration file (e.g., .bashrc or .zshrc):

```bash
echo 'export OPENAI_API_KEY="your-api-key-here"' >> ~/.bashrc
```

If you're using Zsh (the default shell in newer versions of macOS), use .zshrc:

```bash
echo 'export OPENAI_API_KEY="your-api-key-here"' >> ~/.zshrc
```

3. Reload your shell configuration by running:

```bash
source ~/.bashrc
```

Or for Zsh:

```bash
source ~/.zshrc
```

## For Windows:

- Open the Start Menu and search for "Environment Variables."
- Click on "Edit the system environment variables."
- In the "System Properties" window, click the "Environment Variables" button.
  Under "User variables," click "New."
- Set the "Variable name" as OPENAI_API_KEY and the "Variable value" as your OpenAI API key.
- Click "OK" to save the changes.
- After this, your API key will be available for the CLI tool to use.

## Command-line usage:

Once your API key is set up, run the following command to generate the collection.json file from your schema:

## 1. Command-line usage:

Run the command, replacing <path-to-schema.py> with the actual path to your schema file:

```bash
npx apistoryai-generate-collection <path-to-schema.py>
```

## Example:

```bash
npx apistoryai-generate-collection /Users/username/Documents/AIProject/Schemas/schema.py
```

## 2.Generate API Collection:

The script will generate a collection.json file in the current directory. This file will define API endpoints that match the structure of your schema, including paths, methods, descriptions, and database schema.

## Example Schema (python)

The schema here schema.py should defines the database models using an ORM like SQLAlchemy, for example:

```python
class User(Base):
__tablename__ = "users"
id = Column(Integer, primary_key=True)
name = Column(String)
email = Column(String, unique=True)
msisdn = Column(String, unique=True)

class Subscription(Base):
__tablename__ = "subscriptions"
id = Column(Integer, primary_key=True)
user_id = Column(Integer, ForeignKey("users.id"))
service = Column(String)
date_subscribed = Column(Date)
```

## Based on the schema, the generated Collection looks like this:

```json
{
  "endpoints": [
    {
      "path": "/users",
      "method": "GET",
      "description": "Retrieve a list of users",
      "schema": {
        "name": "users",
        "columns": [
          { "name": "name", "type": "string" },
          { "name": "email", "type": "string" },
          { "name": "msisdn", "type": "string" }
        ]
      }
    },
    {
      "path": "/subscriptions_by_users/{user_id}",
      "method": "GET",
      "description": "Get subscriptions for a specific user",
      "parameters": [
        { "name": "user_id", "in": "path", "type": "integer", "required": true }
      ],
      "schema": {
        "name": "subscriptions",
        "columns": [
          { "name": "service", "type": "string" },
          { "name": "date_subscribed", "type": "date" },
          { "name": "user_id", "type": "integer" }
        ]
      }
    }
  ]
}
```

## Requirements

This package uses the following dependencies:

- fs-extra: To read and write files.
- openai: For generating the API collection using OpenAI GPT.
- python-shell: In case of additional Python script execution.

## License

This project is licensed under the ISC License.

## Author

<Developed by> [sterlingking].
