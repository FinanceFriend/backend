import json
import sys

def parse_txt_to_json(file_path):
    with open(file_path, 'r') as file:
        content = file.read()

    def parse_content_to_json(content):
        lessons = []
        current_lesson = {}
        current_sublesson = {}

        for line in content.split('\n'):
            if line.startswith('Week'):
                if current_lesson:
                    lessons.append(current_lesson)
                    current_lesson = {}

                lesson_name = line.split(': ')[1].strip() if ': ' in line else line
                current_lesson['name'] = lesson_name
                current_lesson['sublessons'] = []

            elif line.startswith('Mini-Lesson'):
                if current_sublesson:
                    current_lesson['sublessons'].append(current_sublesson)
                    current_sublesson = {}

                sublesson_name = line.split(': ')[1].strip() if ': ' in line else line
                current_sublesson['name'] = sublesson_name

            elif line.startswith('•\tContent:'):
                current_sublesson['goal'] = line.replace('•\tContent:', '').strip()

        if current_sublesson:
            current_lesson['sublessons'].append(current_sublesson)
        if current_lesson:
            lessons.append(current_lesson)

        return lessons

    json_data = parse_content_to_json(content)

    output_path = file_path.replace('.txt', '_converted.json')
    with open(output_path, 'w') as json_file:
        json.dump(json_data, json_file, indent=4)

    return output_path

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python script.py path_to_your_txt_file.txt")
        sys.exit(1)

    file_path = sys.argv[1]
    output_file = parse_txt_to_json(file_path)
    print(f"Converted JSON file created at: {output_file}")
