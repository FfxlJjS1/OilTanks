using System;
using System.Collections.Generic;

namespace BackendOfSite.EFDbCistern;

public partial class Tovp
{
    public int TovpId { get; set; }

    public string? Name { get; set; }

    public virtual ICollection<Debet> Debets { get; } = new List<Debet>();
}
