
function select(...fields) {
    const op = function select(collection) {
        return collection.map(item => {
            const newItem = {};
            for (const field of fields) {
                if (Object.prototype.hasOwnProperty.call(item, field)) {
                    newItem[field] = item[field];
                }
            }
            return newItem;
        });
    };
    op.type = 'select';
    op.fields = fields;
    return op;
}

function filterIn(field, values) {
    const op = function filterIn(collection) {
        return collection.filter(item => values.includes(item[field]));
    };
    op.type = 'filterIn';
    op.field = field;
    op.values = values;
    return op;
}

function query(collection, ...operations) {
    let result = collection.map(item => ({ ...item }));


    const filters = {};
    const selects = [];

    for (const op of operations) {
        if (op.type === 'filterIn') {
            if (!filters[op.field]) {
                filters[op.field] = new Set(op.values);
            } else {
                const current = filters[op.field];
                filters[op.field] = new Set(op.values.filter(val => current.has(val)));
            }
        } else if (op.type === 'select') {
            selects.push(new Set(op.fields));
        }
    }


    for (const [field, valueSet] of Object.entries(filters)) {
        result = result.filter(item => valueSet.has(item[field]));
    }

 
    let selectedFields = null;
    for (const set of selects) {
        if (selectedFields === null) {
            selectedFields = new Set(set);
        } else {
            selectedFields = new Set([...selectedFields].filter(f => set.has(f)));
        }
    }

    if (selectedFields !== null) {
        result = result.map(item => {
            const newItem = {};
            for (const field of selectedFields) {
                if (Object.prototype.hasOwnProperty.call(item, field)) {
                    newItem[field] = item[field];
                }
            }
            return newItem;
        });
    }

    return result;
}
module.exports = {
    query,
    select,
    filterIn
};