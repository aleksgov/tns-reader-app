from paddlex import create_pipeline

pipeline = create_pipeline(
    pipeline="./ocr_config/pp_structure_config/PP-StructureV3.yaml",
    device="cpu",
)

output = pipeline.predict(
    input="2.pdf",
)

for res in output:
    res.print()
    res.save_to_json(save_path="output")
    res.save_to_img(save_path="output")
    res.save_to_markdown(save_path="output")
    res.save_to_html(save_path="output")
    ocr_res = res.json['res']['overall_ocr_res']
