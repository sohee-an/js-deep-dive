class TreeNode {
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;

  constructor(value: number) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class BinarySearchTree {
  root: TreeNode | null;

  constructor() {
    this.root = null;
  }

  insert(value: number): void {
    const node = new TreeNode(value);

    if (!this.root) {
      this.root = node;
      return;
    }

    let current = this.root;

    while (true) {
      if (value < current.value) {
        if (!current.left) {
          current.left = node;
          return;
        }
        current = current.left;
      } else {
        if (!current.right) {
          current.right = node;
          return;
        }
        current = current.right;
      }
    }
  }

  search(value: number): TreeNode | null {
    if (!this.root) {
      return null;
    }
    let current: TreeNode | null = this.root;
    while (current) {
      if (current.value === value) {
        return current;
      } else if (current.value > value) {
        current = current.left;
      } else {
        current = current.right;
      }
    }
    return null;
  }

  /** 제일 작은 값 찾기 */
  findMin(node: TreeNode | null = this.root): TreeNode | null {
    // TODO
    if (!node) return null;

    let current = node; // this.root 말고 node부터 시작해야 해요

    while (current.left) {
      // 왼쪽이 있으면 계속 내려가기
      current = current.left;
    }

    return current;
  }

  //트리를 정렬된 순서대로
  inorder(node: TreeNode | null = this.root): void {
    // TODO // 왼쪽 - 현재 - 오른쪽

    if (!node) return;

    this.inorder(node.left); // 왼쪽 먼저
    console.log(node.value); // 현재 출력
    this.inorder(node.right); // 오른쪽
  }

  remove(value: number): void {
    // TODO
  }

  bfs(): void {
    if (!this.root) return;

    const queue: TreeNode[] = [];
    queue.push(this.root);
    // TODO 현제 왼족 -오른쪽
    while (queue.length > 0) {
      const current = queue.shift();
      if (!current) {
        return;
      }
      console.log(current.value);
      if (current.left) queue.push(current.left);
      if (current.right) queue.push(current.right);
    }
  }
  //전위
  preorder(node: TreeNode | null = this.root) {
    //현재 -왼쪽-오른쪾
    if (!node) {
      return;
    }
    console.log(node.value);
    this.preorder(node.left);
    this.preorder(node.right);
  }
  //후위
  postorder(node: TreeNode | null = this.root) {
    if (!node) {
      return;
    }
    this.preorder(node.left);
    this.preorder(node.right);
    console.log(node.value);
  }
}

const tree = new BinarySearchTree();
tree.insert(10);
tree.insert(5);
tree.insert(15);
tree.insert(3);
tree.insert(7);

//        10
//       /  \
//      5    15
//     / \
//    3   7
//search 테스트
// console.log(tree.search(5)); // TreeNode { value: 5, ... }
// console.log(tree.search(99)); // null

// console.log(tree.findMin()); // TreeNode { value: 3, ... }
// console.log(tree.findMin(tree.root?.right ?? null));
// console.log(tree.inorder());
// console.log(tree.bfs());
console.log(tree.preorder());
