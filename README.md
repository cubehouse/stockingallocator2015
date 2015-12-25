# Stockings Allocator

For Christmas 2015, my family each made one stocking full of random little presents.
On Christmas morning we then used this little NodeJS script to randomly distribute the stockings to each other, making sure that we didn't get a stocking we helped to put together.

Since some people are in couples, some stockings were collaborations. So, we needed a way of making sure people didn't get a stocking they helped to make while still ensuring that the creators of each stockings were anonymous.

# Usage

Edit people.json to contain the people involved.

Each person uses the up and down arrows to select their name (press Enter).

On the next screen, press space next to each stocking they created. Then press enter to confirm the choices.

Once everybody has entered in their stockings, the program will randomly distribute the stockings.

# Your random allocation is odd

Yeh, I was fighting a cold and wrote it Christmas Eve as fast as possible. It has some sanity checking though and will bail if the allocation is failing so that it can try again.
