using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using System.Collections.Generic;

namespace BackendOfSite.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StructuralAnalysisController : Controller
    {
        readonly string[] formTypes = { "Цилиндрическая" };

        class Column
        {
            public string Name { get; set; } = "";
            public string Width { get; set; } = "";
        }

        class EntityTable
        {
            public List<Column> Columns { get; set; } = new List<Column>();
            public List<List<string>> Rows { get; set; } = new List<List<string>>();
        }

        class EntityResponce
        {
            public EntityTable entityTable { get; set; } = new EntityTable();
            public double minimalSquire { get; set; }
            public double height { get; set; }
        }

        [HttpGet("GetFormTypes")]
        public IActionResult GetFormTypes()
        {
            return Ok(formTypes);
        }

        [HttpGet("AnalyseByFormVolume")]
        public IActionResult AnalyseByFormVolume(int volumeValue)
        {
            EntityTable entityTable = new EntityTable();
            double squire = 0f, height = 0f;


            entityTable.Columns = new List<Column>()
            {
                new Column(){ Name = "Радиус, м", Width = "50px"},
                new Column(){ Name = "Площадь дна, м", Width = "50px"},
                new Column(){ Name = "Длина окружности, м", Width = "50px"},
                new Column(){ Name = "Высота, м", Width = "100px"},
                new Column(){ Name = "Площадь стенок, м2", Width = "100px"},
                new Column(){ Name = "Площадь всех материалов, м2", Width = "150px"},
                new Column() { Name = "Форма, тип", Width="150px"}
            };


            for(int formTypeIndex = 0; formTypeIndex < formTypes.Length; formTypeIndex++)
            {
                List<List<string>> rowsByForm = StructualAnalyzeByForm(formTypeIndex, volumeValue);

                entityTable.Rows.AddRange(rowsByForm);
            }


            EntityResponce entityResponce = new EntityResponce()
            {
                entityTable = entityTable,
                minimalSquire = squire,
                height = height
            };

            return Ok(entityResponce);
        }

        private List<List<string>> StructualAnalyzeByForm(int formTypeIndex, int volumeValue)
        {
            List<List<string>> rows = new List<List<string>>();

            if (formTypeIndex < 0 || formTypeIndex > formTypes.Length)
            {
                return rows;
            }

            string formTypeString = formTypes[formTypeIndex];

            if (formTypeIndex == 0)
            {
                const int maxRadius = 30;

                for (int radius = 1; radius <= maxRadius; radius++)
                {
                    List<string> row = new List<string>
                    {
                        radius.ToString(),
                        Math.Round(radius * radius * Math.PI, 3).ToString(),
                        Math.Round(radius * Math.PI * 2, 3).ToString()
                    };

                    double currHeight = Math.Round(volumeValue / Convert.ToDouble(row[1]), 3);
                    row.Add(currHeight.ToString());
                    row.Add(Math.Round(Convert.ToDouble(row[2]) * Convert.ToDouble(row[3]), 3).ToString());

                    double currSquire = Math.Round(Convert.ToDouble(row[1]) * 2 + Convert.ToDouble(row[4]), 3);
                    row.Add(currSquire.ToString());

                    row.Add(formTypeString);

                    rows.Add(row);
                }
            }

            return rows;
        }
    }
}
