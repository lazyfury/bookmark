import json
import datetime

def transform_json_tagstr_to_tag_array(json_data):
    """
    Transforms the JSON data by converting 'tagstr' to 'tag_array'.
    
    Args:
        json_data (dict): The JSON data to transform.
    
    Returns:
        dict: The transformed JSON data.
    """
    for i,item in enumerate(json_data):
        if 'tags' in item:
            # Split the tag string by commas and strip whitespace
            try:
                # tags like "[key1,key2]"
                tags = item['tags'].replace('[','').replace(']','').split(',')
                tags = [tag.strip() for tag in tags if tag.strip()]  # Remove empty strings
                json_data[i]['tags'] = tags
            except Exception as e:
                print(e)
    return json_data


if __name__ == '__main__':
    input_file_path = input('请输入文件路径：')

    date_format_str = "%Y-%m-%d"
    date_str = datetime.datetime.now().strftime(date_format_str)

    with open(input_file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
        transformed_data = transform_json_tagstr_to_tag_array(data)

        with open(f'output_t_{date_str}.json', 'w', encoding='utf-8') as f:
            json.dump(transformed_data, f, ensure_ascii=False, indent=4)