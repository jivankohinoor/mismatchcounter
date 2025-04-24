# Application Meta Generator
The goal ot this application is to produce the entire technical decomposition of an application, in a readable format, like JSON.
Then, based on this decomposition, the application will generate the assets required using agents

## General Principles

### Atomic decomposition
To keep the generation of code as compact as possible, we will require to have a decomposition of the application breaked down
into its minor details, such as each generated file is maintained below a limit of max 500 lines of code. Wich is already a rather big size.
For that, the idea is to proceed recursively for each level starting from the root, which is the goal of the project itself.
It would be like, I'm the CEO of the company, then I delegate the project to the best experts, which in turn analyse and break down their parts,
that they would give to other experts, or coders at the end for implementing the code.
The experts will be of all kinds required for the type of task

### Prompts Tree Structure
Starting from the root, each subsequent level will be generated through a prompt.
This prompt will vary depending on what level we are, and will always invoke the most AI appropriate specialist or team member to run it.
So, each level will store the prompt that has created it and the prompt to use to create the next level (except for root and leaves)
Then, once a new layer of levels have been created, they will be looped upon to generate the next level.
If the next level is itself a decomposition level, the process will repeat until the level is a code generation task.

### Nodes types
A node can of different type, implicitly:
- The root node: is where you define your project, it contains a pre-forged prompt to create the next level
- A composition node:  that contains other composition nodes
- A folder node: wil contain files
- An asset node: is a node where a file will have to be generated, its a terminal node

### Node attributes
In addition to the prompts, the nodes will also contain some extra data, such as:
- the name of the folder, relative to parent folder in the tree
- the name of the file
- a description for both file and folders

### Context hierarchy
In addition to the previous data, each node will also contain a context, that will be a short summary of what the node is for, so that,
by concatenating all parent context data of a node, and by adding this information as global context to the prompt, we will maximize its success.

### JSON Global File
At the end of this process, all the hierarchy will be stored in a global JSON file containing all nodes, and their data.



