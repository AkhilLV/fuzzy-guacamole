import csv
from datetime import datetime
new_rows = []

with open('csv_data.csv', newline='') as csvfile:
    spamreader = csv.reader(csvfile, delimiter=' ', quotechar='|')
    for i, row in enumerate(spamreader):
        if i == 0:
            continue

        row = row[0].split(",")

        row[0] = formatted_date = datetime.strptime(row[0], "%d/%m/%Y").strftime("%Y-%m-%d")

        new_rows.append(row)

print(new_rows)

with open('processed.csv', 'w', newline='') as csvfile:
    spamwriter = csv.writer(csvfile, delimiter=' ',
                            quotechar='|', quoting=csv.QUOTE_MINIMAL)
    for row in new_rows:
        spamwriter.writerow(",".join(row))