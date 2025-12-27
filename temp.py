import csv

tsv_file = r'D:\Engineer\langappa\public\german_words.tsv'
csv_file = r'D:\Engineer\langappa\public\german_words.csv'

with open(tsv_file, 'r', encoding='utf-8') as infile, open(csv_file, 'w', encoding='utf-8', newline='') as outfile:
    tsv_reader = csv.reader(infile, delimiter='\t')
    csv_writer = csv.writer(outfile)
    for row in tsv_reader:
        csv_writer.writerow(row)
