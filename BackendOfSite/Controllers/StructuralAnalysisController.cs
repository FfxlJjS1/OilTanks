using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace BackendOfSite.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StructuralAnalysisController : Controller
    {
        readonly string[] formTypes = { "Цилиндрическая" };

        class  Column
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
        public IActionResult AnalyseByFormVolume(string formType, int volumeValue)
        {
            EntityTable entityTable = new EntityTable();
            int formTypeIndex = Array.IndexOf(formTypes, formType);
            double squire = 0f, height = 0f;
            bool first = true;

            if(formTypeIndex == -1 || volumeValue <= 0)
            {
                return NotFound();
            }

            if (formTypeIndex == 0)
            {
                const int maxRadius = 120;
                List<string>[] rows = new List<string>[maxRadius];

                entityTable.Columns = new List<Column>()
                {
                    new Column(){ Name = "Радиус, м", Width = "50px"},
                    new Column(){ Name = "Площадь дна, м", Width = "50px"},
                    new Column(){ Name = "Длина окружности, м", Width = "50px"},
                    new Column(){ Name = "Высота, м", Width = "100px"},
                    new Column(){ Name = "Площадь стенок, м2", Width = "100px"},
                    new Column(){ Name = "Площадь всех материалов, м2", Width = "150px"}
                };

                for(int radius = 1; radius <= maxRadius; radius++)
                {
                    List<string> row = new List<string>
                    {
                        radius.ToString(),
                        Math.Round(radius * radius * Math.PI, 3).ToString(),
                        Math.Round(radius * Math.PI * 2, 3).ToString()
                    };

                    double currHeight = Math.Round(volumeValue / Convert.ToDouble(row[1]), 3);
                    row.Add(currHeight.ToString());
                    row.Add(Math.Round(Convert.ToDouble(row[2])* Convert.ToDouble(row[3]), 3).ToString());

                    double currSquire = Math.Round(Convert.ToDouble(row[1]) * 2 + Convert.ToDouble(row[4]), 3);
                    row.Add(currSquire.ToString());

                    if(squire > currSquire || first)
                    {
                        squire = currSquire;
                        height = currHeight;
                        first = false;
                    }

                    rows[radius-1] = row;
                }

                entityTable.Rows = rows.ToList();
            }
            else
            {
                return NotFound();
            }

            EntityResponce entityResponce = new EntityResponce()
            {
                entityTable = entityTable,
                minimalSquire = squire,
                height = height
            };

            return Ok(entityResponce);
        }
    }
}
